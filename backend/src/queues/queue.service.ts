import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('lead-scoring') private readonly leadScoringQueue: Queue,
    @InjectQueue('daily-briefing') private readonly dailyBriefingQueue: Queue,
    @InjectQueue('neglect-detection') private readonly neglectDetectionQueue: Queue,
    @InjectQueue('deal-forecasting') private readonly dealForecastingQueue: Queue,
    @InjectQueue('property-matching') private readonly propertyMatchingQueue: Queue,
    @InjectQueue('ai-tasks') private readonly aiTasksQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.setupQueueEvents();
  }

  private setupQueueEvents() {
    const queues = [
      { name: 'lead-scoring', queue: this.leadScoringQueue },
      { name: 'daily-briefing', queue: this.dailyBriefingQueue },
      { name: 'neglect-detection', queue: this.neglectDetectionQueue },
      { name: 'deal-forecasting', queue: this.dealForecastingQueue },
      { name: 'property-matching', queue: this.propertyMatchingQueue },
      { name: 'ai-tasks', queue: this.aiTasksQueue },
    ];

    for (const { name, queue } of queues) {
      queue.on('completed' as any, (job: Job) => {
        this.logger.debug(`Job ${job.id} completed in ${name}`);
      });

      queue.on('failed' as any, (job: Job | undefined, err: Error) => {
        this.logger.error(`Job ${job?.id} failed in ${name}: ${err.message}`);
      });

      queue.on('stalled' as any, (jobId: string) => {
        this.logger.warn(`Job ${jobId} stalled in ${name}`);
      });
    }
  }

  async addLeadScoringJob(organizationId: string, leadId?: string) {
    return this.leadScoringQueue.add('score-leads', { organizationId, leadId }, {
      jobId: leadId ? `score-${leadId}` : `score-all-${organizationId}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addDailyBriefingJob(organizationId: string, userId: string) {
    return this.dailyBriefingQueue.add('generate-briefing', { organizationId, userId }, {
      jobId: `briefing-${organizationId}-${userId}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addNeglectDetectionJob(organizationId: string) {
    return this.neglectDetectionQueue.add('detect-neglected', { organizationId }, {
      jobId: `neglect-${organizationId}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addDealForecastingJob(organizationId: string, dealId: string) {
    return this.dealForecastingQueue.add('forecast-deal', { organizationId, dealId }, {
      jobId: `forecast-${dealId}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addPropertyMatchingJob(organizationId: string, leadId: string) {
    return this.propertyMatchingQueue.add('match-properties', { organizationId, leadId }, {
      jobId: `match-${leadId}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addAITaskJob(taskType: string, data: Record<string, unknown>) {
    return this.aiTasksQueue.add(taskType, data, {
      jobId: `${taskType}-${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async getQueueStats(queueName: string) {
    const queue = this.getQueue(queueName);
    if (!queue) return null;

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  async getAllQueueStats() {
    const queues = [
      { name: 'lead-scoring', queue: this.leadScoringQueue },
      { name: 'daily-briefing', queue: this.dailyBriefingQueue },
      { name: 'neglect-detection', queue: this.neglectDetectionQueue },
      { name: 'deal-forecasting', queue: this.dealForecastingQueue },
      { name: 'property-matching', queue: this.propertyMatchingQueue },
      { name: 'ai-tasks', queue: this.aiTasksQueue },
    ];

    const stats: Record<string, any> = {};
    for (const { name, queue } of queues) {
      stats[name] = await this.getQueueStats(name);
    }
    return stats;
  }

  private getQueue(name: string): Queue | null {
    switch (name) {
      case 'lead-scoring': return this.leadScoringQueue;
      case 'daily-briefing': return this.dailyBriefingQueue;
      case 'neglect-detection': return this.neglectDetectionQueue;
      case 'deal-forecasting': return this.dealForecastingQueue;
      case 'property-matching': return this.propertyMatchingQueue;
      case 'ai-tasks': return this.aiTasksQueue;
      default: return null;
    }
  }

  async pauseQueue(queueName: string) {
    const queue = this.getQueue(queueName);
    if (queue) await queue.pause();
  }

  async resumeQueue(queueName: string) {
    const queue = this.getQueue(queueName);
    if (queue) await queue.resume();
  }

  async cleanQueue(queueName: string, grace = 24 * 60 * 60 * 1000) {
    const queue = this.getQueue(queueName);
    if (queue) await queue.clean(grace, 100, 'completed');
  }
}