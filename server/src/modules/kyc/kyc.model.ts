import mongoose, { Schema, Document } from 'mongoose';
import { KycStatus } from '@novabank/shared';

export interface IKycRecord extends Document {
  userId: mongoose.Types.ObjectId;
  documentType: string;
  documentNumber: string;
  status: KycStatus;
  notes?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

const KycRecordSchema = new Schema<IKycRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
    status: { type: String, enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    notes: { type: String },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const KycRecord = mongoose.model<IKycRecord>('KycRecord', KycRecordSchema);
