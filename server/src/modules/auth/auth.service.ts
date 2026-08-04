import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User, IUser } from './user.model';
import { config } from '../../config';
import { AppError, UnauthorizedError, ConflictError, NotFoundError } from '../../common/errors/AppError';
import { UserRole } from '@novabank/shared';

export class AuthService {
  public static async register(data: { email: string; password: string; fullName: string; phone?: string; acceptedTerms?: boolean; referredBy?: string }) {
    if (data.acceptedTerms === false) {
      throw new AppError('You must accept the Terms of Service & Privacy Policy to register an account', 400, 'TERMS_REQUIRED');
    }

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    const bankIdNumber = `NVB-${part1}-${part2}-${part3}`;

    const refRand = Math.floor(100000 + Math.random() * 900000);
    const referralCode = `REF-${refRand}`;

    const user = await User.create({
      email: data.email.toLowerCase(),
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: 'USER',
      kycStatus: 'UNVERIFIED',
      twoFactorEnabled: false,
      acceptedTerms: true,
      acceptedTermsAt: new Date(),
      bankIdNumber,
      referralCode,
      referredBy: data.referredBy || undefined,
      referralEarningsUSD: 0,
      passkeyCredentials: [],
    });

    const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

    return {
      user: this.toPublicUser(user),
      tokens,
    };
  }

  public static async login(data: { email: string; password: string; twoFactorCode?: string }) {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.twoFactorEnabled) {
      if (!data.twoFactorCode) {
        throw new AppError('2FA code is required', 402, 'TWO_FACTOR_REQUIRED');
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret || '',
        encoding: 'base32',
        token: data.twoFactorCode,
      });

      if (!verified) {
        throw new UnauthorizedError('Invalid 2FA authentication code');
      }
    }

    const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

    return {
      user: this.toPublicUser(user),
      tokens,
    };
  }

  public static async generate2FA(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const secret = speakeasy.generateSecret({
      name: `NovaBank (${user.email})`,
      issuer: 'NovaBank Crypto Platform',
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  public static async verify2FA(userId: string, token: string) {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new AppError('2FA not initialized', 400);
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new UnauthorizedError('Invalid 2FA token');
    }

    user.twoFactorEnabled = true;
    await user.save();

    return { success: true, message: '2FA enabled successfully' };
  }

  public static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return this.toPublicUser(user);
  }

  public static generateTokens(userId: string, email: string, role: UserRole) {
    const accessToken = jwt.sign(
      { userId, email, role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId, email, role },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  public static toPublicUser(user: IUser) {
    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
      isTwoFactorEnabled: user.twoFactorEnabled,
      hasPasskey: user.passkeyCredentials ? user.passkeyCredentials.length > 0 : false,
      bankIdNumber: user.bankIdNumber || 'NVB-1000-0000-0000',
      referralCode: user.referralCode || 'REF-000000',
      referredBy: user.referredBy,
      referralEarningsUSD: user.referralEarningsUSD || 0,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
