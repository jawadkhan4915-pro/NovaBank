import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, KycStatus } from '@novabank/shared';

export interface IPasskeyCredential {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  transports?: string[];
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  kycStatus: KycStatus;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  acceptedTerms: boolean;
  acceptedTermsAt?: Date;
  passkeyCredentials: IPasskeyCredential[];
  createdAt: Date;
  updatedAt: Date;
}

const PasskeySchema = new Schema<IPasskeyCredential>({
  credentialID: { type: String, required: true },
  credentialPublicKey: { type: String, required: true },
  counter: { type: Number, required: true, default: 0 },
  transports: [{ type: String }],
});

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN', 'COMPLIANCE_OFFICER'], default: 'USER' },
    kycStatus: { type: String, enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'], default: 'UNVERIFIED' },
    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    acceptedTerms: { type: Boolean, default: true },
    acceptedTermsAt: { type: Date, default: Date.now },
    passkeyCredentials: [PasskeySchema],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
