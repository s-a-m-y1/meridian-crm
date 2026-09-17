import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as crypto from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '../users/users.service';

export interface ResetTokenPayload {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
  ) {}

  generateResetToken(): ResetTokenPayload {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const ttlMs = this.parseExpiry(this.config.get<string>('jwt.refreshExpiresIn') ?? '1h');
    return { token, tokenHash, expiresAt: new Date(Date.now() + ttlMs) };
  }

  async requestReset(email: string): Promise<{ token?: string; message: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const { token, tokenHash, expiresAt } = this.generateResetToken();
    await this.refreshRepo.save({
      userId: user.id,
      tokenHash,
      familyId: 'reset',
      expiresAt,
    });

    const isDev = this.config.get<string>('nodeEnv') !== 'production';
    return isDev
      ? { token, message: 'Reset token generated (dev mode)' }
      : { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPasswordHash: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await this.refreshRepo.findOne({
      where: { tokenHash, familyId: 'reset', revokedAt: IsNull() },
    });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    await this.users.updatePassword(resetToken.userId, newPasswordHash);
    await this.refreshRepo.update(
      { userId: resetToken.userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 60 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return value * (multipliers[unit as keyof typeof multipliers] ?? 1000);
  }
}