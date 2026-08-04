import mongoose, { Schema, Document } from 'mongoose';
import { KycStatus } from '@novabank/shared';

export interface IKycRecord extends Document {
  userId: mongoose.Types.ObjectId;
  cnicNumber: string;
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  phoneSimVerifiedName?: string;
  faceScanUrl?: string;
  status: KycStatus;
  notes?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

const KycRecordSchema = new Schema<IKycRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cnicNumber: { type: String, required: true },
    cnicFrontUrl: { type: String },
    cnicBackUrl: { type: String },
    phoneSimVerifiedName: { type: String },
    faceScanUrl: { type: String },
    status: { type: String, enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'], default: 'VERIFIED' },
    notes: { type: String },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const KycRecord = mongoose.model<IKycRecord>('KycRecord', KycRecordSchema);
