import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { LeadScoringProcessor } from './processors/lead-scoring.processor';
import { DailyBriefingProcessor } from './processors/daily-briefing.processor';
import { NeglectDetectionProcessor } from './processors/neglect-detection.processor';
import { DealForecastingProcessor } from './processors/deal-forecasting.processor';
import { PropertyMatchingProcessor } from './processors/property-matching.processor';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { Lead } from '../modules/leads/lead.entity';
import { Deal } from '../modules/deals/deal.entity';
import { Task } from '../modules/tasks/task.entity';
import { Activity } from '../modules/activities/activity.entity';
import { Property } from '../modules/properties/property.entity';
import { Customer } from '../modules/customers/customer.entity';
import { LeadScoringService } from '../ai/services/lead-scoring.service';
import { DailyBriefingService } from '../ai/services/daily-briefing.service';
import { DealForecastingService } from '../ai/services/deal-forecasting.service';
import { PropertyMatchingService } from '../ai/services/property-matching.service';
import { NeglectDetectionService } from '../ai/services/neglect-detection.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Deal, Task, Activity, Property, Customer]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') ?? 'localhost',
          port: configService.get<number>('REDIS_PORT') ?? 6379,
          password: configService.get<string>('REDIS_PASSWORD') ?? undefined,
          db: configService.get<number>('REDIS_DB') ?? 0,
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
          lazyConnect: false,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'lead-scoring' },
      { name: 'daily-briefing' },
      { name: 'neglect-detection' },
      { name: 'deal-forecasting' },
      { name: 'property-matching' },
      { name: 'ai-tasks' },
    ),
  ],
  providers: [
    QueueService,
    LeadScoringProcessor,
    DailyBriefingProcessor,
    NeglectDetectionProcessor,
    DealForecastingProcessor,
    PropertyMatchingProcessor,
    ScheduledJobsService,
    LeadScoringService,
    DailyBriefingService,
    DealForecastingService,
    PropertyMatchingService,
    NeglectDetectionService,
  ],
  exports: [
    QueueService,
    ScheduledJobsService,
    LeadScoringService,
    DailyBriefingService,
    DealForecastingService,
    PropertyMatchingService,
    NeglectDetectionService,
  ],
})
export class QueueModule {}
