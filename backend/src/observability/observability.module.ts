import { Module, Global } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit.service';
import { MetricsService } from './metrics.service';
import { LoggingService } from './logging.service';
import { TracingService } from './tracing.service';
import { AuditService } from './audit.service';
import { HealthController } from './health.controller';

@Global()
@Module({
  imports: [
    TerminusModule,
    ConfigModule,
    TypeOrmModule.forFeature([AuditLog]),
  ],
  controllers: [HealthController],
  providers: [
    MetricsService,
    LoggingService,
    TracingService,
    AuditService,
  ],
  exports: [
    MetricsService,
    LoggingService,
    TracingService,
    AuditService,
  ],
})
export class ObservabilityModule {}
