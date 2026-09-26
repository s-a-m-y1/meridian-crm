import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { TokenService, TokenPair } from './token.service';
import { PasswordResetService } from './password-reset.service';
import { EmailService } from '../../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly orgs: OrganizationsService,
    private readonly tokens: TokenService,
    private readonly passwordReset: PasswordResetService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, this.config.get<number>('bcryptRounds') ?? 12);
    const user = await this.users.create({ email: dto.email, name: dto.name, passwordHash });
    await this.orgs.createWithOwner(`${dto.name}'s Organization`, user.id);

    // Generate email verification token
    const verificationToken = uuidv4();
    await this.users.setEmailVerificationToken(user.id, verificationToken);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send verification email:', error);
    }

    return this.issueTokens(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email);
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    const tokenHash = this.tokens.hashToken(dto.refreshToken);
    const stored = await this.refreshRepo.findOne({ where: { tokenHash } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Reuse detection
    const familyUsed = await this.refreshRepo.findOne({
      where: { familyId: stored.familyId, revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    if (familyUsed && familyUsed.id !== stored.id) {
      await this.refreshRepo.update(
        { familyId: stored.familyId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
      throw new UnauthorizedException('Token reuse detected — session revoked');
    }

    stored.revokedAt = new Date();
    await this.refreshRepo.save(stored);

    const user = await this.users.findById(stored.userId);
    if (!user) throw new UnauthorizedException('User not found');

    return this.issueTokens(user.id, user.email, stored.familyId);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.tokens.hashToken(refreshToken);
    await this.refreshRepo.update(
      { tokenHash, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; token?: string }> {
    const result = await this.passwordReset.requestReset(dto.email);
    
    // If user exists, send password reset email
    const user = await this.users.findByEmail(dto.email);
    if (user && result.token) {
      try {
        await this.emailService.sendPasswordResetEmail(user.email, user.name, result.token);
      } catch (error) {
        console.error('Failed to send password reset email:', error);
      }
    }
    
    return result;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const passwordHash = await bcrypt.hash(dto.password, this.config.get<number>('bcryptRounds') ?? 12);
    await this.passwordReset.resetPassword(dto.token, passwordHash);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new ConflictException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(newPassword, this.config.get<number>('bcryptRounds') ?? 12);
    await this.users.updatePassword(user.id, passwordHash);

    // Password change revokes every other live session for the user.
    await this.refreshRepo.update(
      { userId: user.id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async verifyEmail(token: string): Promise<void> {
    return this.users.verifyEmail(token);
  }

  private async issueTokens(userId: string, email: string, familyId?: string): Promise<TokenPair> {
    const pair = this.tokens.generateTokenPair(userId, email);
    if (familyId) {
      const newPair = this.tokens.generateTokenPair(userId, email);
      newPair.familyId = familyId;
      await this.persistRefreshToken(userId, newPair);
      return newPair;
    }
    await this.persistRefreshToken(userId, pair);
    return pair;
  }

  private async persistRefreshToken(userId: string, pair: TokenPair): Promise<void> {
    await this.refreshRepo.save({
      userId,
      tokenHash: pair.refreshTokenHash,
      familyId: pair.familyId,
      expiresAt: new Date(pair.expiresIn * 1000),
    });
  }
}
