import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DailyBriefingService } from '../../ai/services/daily-briefing.service';

@Processor('daily-briefing', { concurrency: 3 })
@Injectable()
export class DailyBriefingProcessor extends WorkerHost {
  private readonly logger = new Logger(DailyBriefingProcessor.name);

  constructor(
    private readonly dailyBriefingService: DailyBriefingService,
  ) {
    super();
  }

  async process(job: Job<{ organizationId: string; userId: string }>): Promise<any> {
    const { organizationId, userId } = job.data;
    this.logger.log(`Generating daily briefing for user ${userId} in org ${organizationId}`);

    await job.updateProgress(10);
    
    const briefing = await this.dailyBriefingService.generateBriefing(userId, organizationId);
    
    await job.updateProgress(100);

    return briefing;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Daily briefing job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(`Daily briefing job ${job?.id} failed: ${err.message}`);
  }
}