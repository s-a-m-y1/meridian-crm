import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DealForecastingService } from '../../ai/services/deal-forecasting.service';

@Processor('deal-forecasting', { concurrency: 3 })
@Injectable()
export class DealForecastingProcessor extends WorkerHost {
  private readonly logger = new Logger(DealForecastingProcessor.name);

  constructor(
    private readonly dealForecastingService: DealForecastingService,
  ) {
    super();
  }

  async process(job: Job<{ organizationId: string; dealId: string }>): Promise<any> {
    const { organizationId, dealId } = job.data;
    this.logger.log(`Forecasting deal ${dealId} for org ${organizationId}`);

    await job.updateProgress(10);
    
    const forecast = await this.dealForecastingService.forecastDeal(dealId, organizationId);
    
    await job.updateProgress(100);

    return { dealId, ...forecast };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Deal forecasting job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(`Deal forecasting job ${job?.id} failed: ${err.message}`);
  }
}