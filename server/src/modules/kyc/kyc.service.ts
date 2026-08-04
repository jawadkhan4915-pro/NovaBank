import { KycRecord } from './kyc.model';
import { User } from '../auth/user.model';
import { WalletService } from '../wallets/wallet.service';
import { AppError, NotFoundError } from '../../common/errors/AppError';
import { KycStatus } from '@novabank/shared';

export class KycService {
  public static async submitKyc(
    userId: string,
    cnicNumber: string,
    phoneSimVerifiedName: string,
    cnicFrontUrl?: string,
    cnicBackUrl?: string,
    faceScanUrl?: string
  ) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const kycRecord = await KycRecord.create({
      userId,
      cnicNumber: cnicNumber || '42101-9876543-1',
      phoneSimVerifiedName: phoneSimVerifiedName || user.fullName,
      cnicFrontUrl: cnicFrontUrl || 'uploaded_cnic_front.jpg',
      cnicBackUrl: cnicBackUrl || 'uploaded_cnic_back.jpg',
      faceScanUrl: faceScanUrl || 'uploaded_face_scan.jpg',
      status: 'VERIFIED',
      verifiedAt: new Date(),
    });

    user.kycStatus = 'VERIFIED';
    await user.save();

    // Check referral reward ($2 USD) if user was referred by someone
    if (user.referredBy) {
      try {
        const referrer = await User.findOne({
          $or: [
            { referralCode: user.referredBy },
            { bankIdNumber: user.referredBy },
          ],
        });

        if (referrer) {
          referrer.referralEarningsUSD = (referrer.referralEarningsUSD || 0) + 2.0;
          await referrer.save();

          await WalletService.recordLedgerEntry({
            userId: referrer._id.toString(),
            currency: 'USD',
            amount: 2.0,
            type: 'credit',
            refType: 'REFERRAL_REWARD',
            refId: `ref_reward_${user._id.toString()}`,
          });
        }
      } catch (err) {
        console.error('Error crediting referral reward:', err);
      }
    }

    return kycRecord;
  }

  public static async getStatus(userId: string) {
    const record = await KycRecord.findOne({ userId }).sort({ createdAt: -1 });
    return record;
  }

  public static async reviewKyc(recordId: string, status: KycStatus, notes?: string) {
    const record = await KycRecord.findById(recordId);
    if (!record) throw new NotFoundError('KYC record not found');

    record.status = status;
    record.notes = notes;
    if (status === 'VERIFIED') {
      record.verifiedAt = new Date();
    }
    await record.save();

    const user = await User.findById(record.userId);
    if (user) {
      user.kycStatus = status;
      await user.save();
    }

    return record;
  }

  public static async getPendingReviews() {
    return await KycRecord.find({ status: 'PENDING' }).populate('userId', 'email fullName');
  }
}
