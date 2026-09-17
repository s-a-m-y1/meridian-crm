import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { PasswordResetService } from './password-reset.service';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: '$2a$04$hashedpassword',
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOrg = {
  id: 'org-1',
  name: 'Test Org',
  currency: 'USD',
  timezone: 'UTC',
};

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let orgsService: Partial<OrganizationsService>;
  let tokenService: Partial<TokenService>;
  let passwordResetService: Partial<PasswordResetService>;
  let refreshRepo: Partial<Repository<RefreshToken>>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updatePassword: jest.fn(),
      verifyEmail: jest.fn(),
    };
    orgsService = {
      createWithOwner: jest.fn(),
      getMembership: jest.fn(),
      getFirstMembership: jest.fn(),
      getOrganizationsForUser: jest.fn(),
    };
    tokenService = {
      generateAccessToken: jest.fn(),
      generateTokenPair: jest.fn(),
      hashToken: jest.fn(),
      parseExpiry: jest.fn(),
      verifyAccessToken: jest.fn(),
    };
    passwordResetService = {
      requestReset: jest.fn(),
      resetPassword: jest.fn(),
    };
    refreshRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, unknown> = {
          'bcryptRounds': 4,
          'jwt.secret': 'test-secret',
          'jwt.expiresIn': '900s',
          'jwt.refreshSecret': 'test-refresh-secret',
          'jwt.refreshExpiresIn': '30d',
          'nodeEnv': 'test',
          'throttle.ttlMs': 60000,
          'throttle.limit': 300,
          'throttle.authTtlMs': 60000,
          'throttle.authLimit': 10,
        };
        return map[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: OrganizationsService, useValue: orgsService },
        { provide: TokenService, useValue: tokenService },
        { provide: PasswordResetService, useValue: passwordResetService },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshRepo },
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = { email: 'new@example.com', name: 'New User', password: 'Password123!' };

    it('should throw ConflictException if email exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should create user, organization, and return tokens', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);
      (orgsService.createWithOwner as jest.Mock).mockResolvedValue({ organization: mockOrg, member: {} });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (tokenService.generateTokenPair as jest.Mock).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshTokenHash: 'hash',
        familyId: 'family-1',
        expiresIn: Math.floor(Date.now() / 1000) + 3600,
      });
      (refreshRepo.save as jest.Mock).mockResolvedValue({});

      const result = await service.register(registerDto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
        email: registerDto.email,
        name: registerDto.name,
      }));
      expect(orgsService.createWithOwner).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'Password123!' };

    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on successful login', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (tokenService.generateTokenPair as jest.Mock).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshTokenHash: 'hash',
        familyId: 'family-1',
        expiresIn: Math.floor(Date.now() / 1000) + 3600,
      });
      (refreshRepo.save as jest.Mock).mockResolvedValue({});

      const result = await service.login(loginDto);
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if token not found', async () => {
      (tokenService.hashToken as jest.Mock).mockReturnValue('hash');
      (refreshRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.refresh({ refreshToken: 'token' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token revoked', async () => {
      (tokenService.hashToken as jest.Mock).mockReturnValue('hash');
      (refreshRepo.findOne as jest.Mock).mockResolvedValue({ revokedAt: new Date() });
      await expect(service.refresh({ refreshToken: 'token' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token expired', async () => {
      (tokenService.hashToken as jest.Mock).mockReturnValue('hash');
      (refreshRepo.findOne as jest.Mock).mockResolvedValue({ expiresAt: new Date(Date.now() - 1000) });
      await expect(service.refresh({ refreshToken: 'token' })).rejects.toThrow(UnauthorizedException);
    });
  });
});