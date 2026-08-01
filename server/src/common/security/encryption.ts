import crypto from 'crypto';
import { config } from '../../config';

const ALGORITHM = 'aes-256-gcm';

export class EncryptionService {
  private static getKey(): Buffer {
    return Buffer.from(config.encryptionKey, 'hex');
  }

  public static encrypt(text: string): { encryptedData: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, this.getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      tag: tag,
    };
  }

  public static decrypt(encryptedData: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      this.getKey(),
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
