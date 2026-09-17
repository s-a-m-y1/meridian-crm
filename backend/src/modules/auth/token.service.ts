import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  familyId: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access';
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(userId: string, email: string): string {
    return this.jwt.sign(
      { sub: userId, email, type: 'access' },
      {
        secret: this.config.get<string>('jwt.secret'),
        expiresIn: this.config.get<string>('jwt.expiresIn'),
      },
    );
  }

  generateTokenPair(userId: string, email: string): TokenPair {
    const familyId = crypto.randomBytes(16).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);

    const expiresInMs = this.parseExpiry(
      this.config.get<string>('jwt.refreshExpiresIn') ?? '30d',
    );
    const expiresAt = new Date(Date.now() + expiresInMs);

    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken,
      refreshTokenHash,
      familyId,
      expiresIn: Math.floor(expiresAt.getTime() / 1000),
    };
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return value * (multipliers[unit as keyof typeof multipliers] ?? 1000);
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwt.verify<JwtPayload>(token, { secret: this.config.get<string>('jwt.secret') });
    } catch {
      return null;
    }
  }
}