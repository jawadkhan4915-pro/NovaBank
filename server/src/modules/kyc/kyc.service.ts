import { KycRecord } from './kyc.model';
import { User } from '../auth/user.model';
import { AppError, NotFoundError } from '../../common/errors/AppError';
import { KycStatus } from '@novabank/shared';

export class KycService {
  public static async submitKyc(userId: string, documentType: string, documentNumber: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const kycRecord = await KycRecord.create({
      userId,
      documentType,
      documentNumber,
      status: 'PENDING',
    });

    user.kycStatus = 'PENDING';
    await user.save();

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
