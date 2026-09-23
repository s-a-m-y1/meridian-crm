import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TerminusModule, HealthCheck, HealthCheckService, HealthCheckResult, HealthIndicatorResult, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { QueueService } from '../queues/queue.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly queueService: QueueService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
      () => this.checkQueue('lead-scoring'),
      () => this.checkQueue('daily-briefing'),
      () => this.checkQueue('neglect-detection'),
      () => this.checkQueue('deal-forecasting'),
      () => this.checkQueue('property-matching'),
      () => this.checkQueue('ai-tasks'),
    ]);
  }

  @Get('liveness')
  @Public()
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async liveness(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  @Get('readiness')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkQueue('lead-scoring'),
    ]);
  }

  private async checkQueue(name: string): Promise<HealthIndicatorResult> {
    try {
      const stats = await this.queueService.getQueueStats(name);
      if (!stats) {
        return { [name]: { status: 'down', error: 'Queue not found' } };
      }
      const isHealthy = stats.waiting >= 0 && stats.active >= 0;
      return {
        [name]: {
          status: isHealthy ? 'up' : 'down',
          waiting: stats.waiting,
          active: stats.active,
        },
      };
    } catch (error) {
      return {
        [name]: {
          status: 'down',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  async metrics() {
    return { message: 'Metrics available at /metrics on port 9464' };
  }
}
