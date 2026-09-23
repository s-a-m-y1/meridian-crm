import { Module, Global } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityHeadersMiddleware } from './security-headers.middleware';
import { ValidationPipe } from './validation.pipe';
import { RateLimiterGuard } from './rate-limiter.guard';
import { PasswordStrengthService } from './password-strength.service';
import { SecurityAuditService } from './security-audit.service';
import { SecurityController } from './security.controller';
import { User } from '../modules/users/user.entity';
import { OrganizationsModule } from '../modules/organizations/organizations.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    OrganizationsModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: configService.get<number>('throttle.ttlMs') ?? 60000,
            limit: configService.get<number>('throttle.limit') ?? 300,
          },
          {
            name: 'auth',
            ttl: configService.get<number>('throttle.authTtlMs') ?? 60000,
            limit: configService.get<number>('throttle.authLimit') ?? 10,
          },
          {
            name: 'ai',
            ttl: configService.get<number>('throttle.aiTtlMs') ?? 60000,
            limit: configService.get<number>('throttle.aiLimit') ?? 30,
          },
        ],
      }),
    }),
  ],
  controllers: [SecurityController],
  providers: [
    SecurityHeadersMiddleware,
    ValidationPipe,
    RateLimiterGuard,
    PasswordStrengthService,
    SecurityAuditService,
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
    {
      provide: 'APP_GUARD',
      useClass: RateLimiterGuard,
    },
  ],
  exports: [
    SecurityHeadersMiddleware,
    ValidationPipe,
    RateLimiterGuard,
    PasswordStrengthService,
    SecurityAuditService,
  ],
})
export class SecurityModule {}
