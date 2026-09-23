import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { LeadScoringService } from '../../ai/services/lead-scoring.service';

@Processor('lead-scoring', { concurrency: 5 })
@Injectable()
export class LeadScoringProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadScoringProcessor.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    private readonly leadScoringService: LeadScoringService,
  ) {
    super();
  }

  async process(job: Job<{ organizationId: string; leadId?: string }>): Promise<any> {
    const { organizationId, leadId } = job.data;
    this.logger.log(`Processing lead scoring for org ${organizationId}${leadId ? `, lead ${leadId}` : ''}`);

    if (leadId) {
      return this.scoreSingleLead(leadId, organizationId, job);
    } else {
      return this.scoreAllLeads(organizationId, job);
    }
  }

  private async scoreSingleLead(leadId: string, organizationId: string, job: Job) {
    await job.updateProgress(10);
    
    const result = await this.leadScoringService.scoreLead(leadId, organizationId);
    
    await job.updateProgress(100);
    return { leadId, ...result };
  }

  private async scoreAllLeads(organizationId: string, job: Job) {
    const leads = await this.leadRepo.find({
      where: { organizationId },
      select: ['id'],
    });

    const total = leads.length;
    let processed = 0;
    const results = [];

    for (const lead of leads) {
      try {
        const result = await this.leadScoringService.scoreLead(lead.id, organizationId);
        results.push({ leadId: lead.id, ...result });
      } catch (error: unknown) {
        this.logger.error(`Failed to score lead ${lead.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ leadId: lead.id, error: errorMessage });
      }

      processed++;
      await job.updateProgress(Math.round((processed / total) * 100));
    }

    return { processed, total, results };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Lead scoring job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(`Lead scoring job ${job?.id} failed: ${err.message}`);
  }
}