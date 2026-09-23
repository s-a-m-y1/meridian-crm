import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PropertyMatchingService } from '../../ai/services/property-matching.service';

@Processor('property-matching', { concurrency: 3 })
@Injectable()
export class PropertyMatchingProcessor extends WorkerHost {
  private readonly logger = new Logger(PropertyMatchingProcessor.name);

  constructor(
    private readonly propertyMatchingService: PropertyMatchingService,
  ) {
    super();
  }

  async process(job: Job<{ organizationId: string; leadId: string }>): Promise<any> {
    const { organizationId, leadId } = job.data;
    this.logger.log(`Matching properties for lead ${leadId} in org ${organizationId}`);

    await job.updateProgress(10);
    
    const matches = await this.propertyMatchingService.matchProperties(leadId, organizationId);
    
    await job.updateProgress(100);

    return { leadId, ...matches };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Property matching job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(`Property matching job ${job?.id} failed: ${err.message}`);
  }
}