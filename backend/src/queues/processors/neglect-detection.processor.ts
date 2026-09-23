import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NeglectDetectionService } from '../../ai/services/neglect-detection.service';

@Processor('neglect-detection', { concurrency: 2 })
@Injectable()
export class NeglectDetectionProcessor extends WorkerHost {
  private readonly logger = new Logger(NeglectDetectionProcessor.name);

  constructor(
    private readonly neglectDetectionService: NeglectDetectionService,
  ) {
    super();
  }

  async process(job: Job<{ organizationId: string; daysThreshold?: number }>): Promise<any> {
    const { organizationId, daysThreshold = 14 } = job.data;
    this.logger.log(`Running neglect detection for org ${organizationId} with threshold ${daysThreshold} days`);

    await job.updateProgress(10);
    
    const neglectedLeads = await this.neglectDetectionService.detectNeglectedLeads(organizationId, daysThreshold);
    
    await job.updateProgress(100);

    return { organizationId, neglectedLeadsCount: neglectedLeads.length, neglectedLeads };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Neglect detection job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(`Neglect detection job ${job?.id} failed: ${err.message}`);
  }
}