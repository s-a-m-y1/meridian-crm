import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueService } from './queue.service';

@Injectable()
export class ScheduledJobsService implements OnModuleInit {
  private readonly logger = new Logger(ScheduledJobsService.name);

  constructor(private readonly queueService: QueueService) {}

  async onModuleInit() {
    this.setupScheduledJobs();
  }

  private setupScheduledJobs() {
    // Daily lead scoring at 2 AM
    this.scheduleDailyJob('daily-lead-scoring', '0 2 * * *', async () => {
      this.logger.log('Running scheduled daily lead scoring');
      // This would be triggered per organization in production
      // For now, we just log
    });

    // Daily briefings at 6 AM
    this.scheduleDailyJob('daily-briefings', '0 6 * * *', async () => {
      this.logger.log('Running scheduled daily briefings');
      // This would iterate through organizations and users
    });

    // Neglect detection every 6 hours
    this.scheduleRecurringJob('neglect-detection-every-6h', '0 */6 * * *', async () => {
      this.logger.log('Running scheduled neglect detection');
      // This would iterate through organizations
    });

    // Deal forecasting daily at 3 AM
    this.scheduleDailyJob('daily-deal-forecasting', '0 3 * * *', async () => {
      this.logger.log('Running scheduled deal forecasting');
    });

    // Property matching daily at 4 AM
    this.scheduleDailyJob('daily-property-matching', '0 4 * * *', async () => {
      this.logger.log('Running scheduled property matching');
    });

    this.logger.log('Scheduled jobs initialized');
  }

  private scheduleDailyJob(name: string, cronExpression: string, callback: () => Promise<void>) {
    // In production, use @nestjs/schedule or a proper cron library
    // For now, we just log the schedule
    this.logger.debug(`Scheduled daily job: ${name} at ${cronExpression}`);
  }

  private scheduleRecurringJob(name: string, cronExpression: string, callback: () => Promise<void>) {
    // In production, use @nestjs/schedule or a proper cron library
    // For now, we just log the schedule
    this.logger.debug(`Scheduled recurring job: ${name} at ${cronExpression}`);
  }

  async triggerDailyLeadScoring(organizationId: string) {
    return this.queueService.addLeadScoringJob(organizationId);
  }

  async triggerDailyBriefings(organizationId: string, userIds: string[]) {
    const jobs = userIds.map(userId => 
      this.queueService.addDailyBriefingJob(organizationId, userId)
    );
    return Promise.all(jobs);
  }

  async triggerNeglectDetection(organizationId: string) {
    return this.queueService.addNeglectDetectionJob(organizationId);
  }

  async triggerDealForecasting(organizationId: string, dealIds: string[]) {
    const jobs = dealIds.map(dealId => 
      this.queueService.addDealForecastingJob(organizationId, dealId)
    );
    return Promise.all(jobs);
  }

  async triggerPropertyMatching(organizationId: string, leadIds: string[]) {
    const jobs = leadIds.map(leadId => 
      this.queueService.addPropertyMatchingJob(organizationId, leadId)
    );
    return Promise.all(jobs);
  }
}