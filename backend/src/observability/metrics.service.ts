import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private readonly registry: Registry;
  private collectInterval?: NodeJS.Timeout;

  // HTTP Metrics
  httpRequestsTotal: Counter;
  httpRequestDuration: Histogram;
  httpRequestsInFlight: Gauge;

  // Business Metrics
  leadsCreatedTotal: Counter;
  leadsConvertedTotal: Counter;
  dealsCreatedTotal: Counter;
  dealsWonTotal: Counter;
  dealsLostTotal: Counter;
  tasksCompletedTotal: Counter;
  aiRequestsTotal: Counter;
  aiRequestDuration: Histogram;
  queueJobsTotal: Counter;
  queueJobDuration: Histogram;

  // System Metrics
  activeUsers: Gauge;
  activeOrganizations: Gauge;

  constructor() {
    this.registry = new Registry();
    this.registerDefaultMetrics();
    this.initializeCustomMetrics();
  }

  private registerDefaultMetrics() {
    collectDefaultMetrics({ register: this.registry, prefix: 'crm_' });
  }

  private initializeCustomMetrics() {
    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'crm_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'crm_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsInFlight = new Gauge({
      name: 'crm_http_requests_in_flight',
      help: 'Number of HTTP requests currently being processed',
      labelNames: ['method', 'path'],
      registers: [this.registry],
    });

    // Business Metrics
    this.leadsCreatedTotal = new Counter({
      name: 'crm_leads_created_total',
      help: 'Total number of leads created',
      labelNames: ['organization_id', 'source'],
      registers: [this.registry],
    });

    this.leadsConvertedTotal = new Counter({
      name: 'crm_leads_converted_total',
      help: 'Total number of leads converted',
      labelNames: ['organization_id'],
      registers: [this.registry],
    });

    this.dealsCreatedTotal = new Counter({
      name: 'crm_deals_created_total',
      help: 'Total number of deals created',
      labelNames: ['organization_id', 'stage'],
      registers: [this.registry],
    });

    this.dealsWonTotal = new Counter({
      name: 'crm_deals_won_total',
      help: 'Total number of deals won',
      labelNames: ['organization_id'],
      registers: [this.registry],
    });

    this.dealsLostTotal = new Counter({
      name: 'crm_deals_lost_total',
      help: 'Total number of deals lost',
      labelNames: ['organization_id'],
      registers: [this.registry],
    });

    this.tasksCompletedTotal = new Counter({
      name: 'crm_tasks_completed_total',
      help: 'Total number of tasks completed',
      labelNames: ['organization_id', 'owner_id'],
      registers: [this.registry],
    });

    this.aiRequestsTotal = new Counter({
      name: 'crm_ai_requests_total',
      help: 'Total number of AI requests',
      labelNames: ['provider', 'model', 'operation', 'status'],
      registers: [this.registry],
    });

    this.aiRequestDuration = new Histogram({
      name: 'crm_ai_request_duration_seconds',
      help: 'AI request duration in seconds',
      labelNames: ['provider', 'operation'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.registry],
    });

    this.queueJobsTotal = new Counter({
      name: 'crm_queue_jobs_total',
      help: 'Total number of queue jobs processed',
      labelNames: ['queue', 'status'],
      registers: [this.registry],
    });

    this.queueJobDuration = new Histogram({
      name: 'crm_queue_job_duration_seconds',
      help: 'Queue job duration in seconds',
      labelNames: ['queue'],
      buckets: [1, 5, 10, 30, 60, 300, 600],
      registers: [this.registry],
    });

    // System Metrics
    this.activeUsers = new Gauge({
      name: 'crm_active_users',
      help: 'Number of active users',
      labelNames: ['organization_id'],
      registers: [this.registry],
    });

    this.activeOrganizations = new Gauge({
      name: 'crm_active_organizations',
      help: 'Number of active organizations',
      registers: [this.registry],
    });
  }

  onModuleInit() {
    // Start periodic collection of active organizations
    this.collectInterval = setInterval(() => {
      this.activeOrganizations.set(0); // Would be updated by actual service
    }, 60000);
  }

  onModuleDestroy() {
    if (this.collectInterval) {
      clearInterval(this.collectInterval);
    }
  }

  // HTTP Metrics Methods
  incrementHttpRequests(method: string, path: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, path, status_code: String(statusCode) });
  }

  observeHttpDuration(method: string, path: string, durationSeconds: number) {
    this.httpRequestDuration.observe({ method, path }, durationSeconds);
  }

  incrementHttpInFlight(method: string, path: string) {
    this.httpRequestsInFlight.inc({ method, path });
  }

  decrementHttpInFlight(method: string, path: string) {
    this.httpRequestsInFlight.dec({ method, path });
  }

  // Business Metrics Methods
  incrementLeadsCreated(organizationId: string, source: string) {
    this.leadsCreatedTotal.inc({ organization_id: organizationId, source });
  }

  incrementLeadsConverted(organizationId: string) {
    this.leadsConvertedTotal.inc({ organization_id: organizationId });
  }

  incrementDealsCreated(organizationId: string, stage: string) {
    this.dealsCreatedTotal.inc({ organization_id: organizationId, stage });
  }

  incrementDealsWon(organizationId: string) {
    this.dealsWonTotal.inc({ organization_id: organizationId });
  }

  incrementDealsLost(organizationId: string) {
    this.dealsLostTotal.inc({ organization_id: organizationId });
  }

  incrementTasksCompleted(organizationId: string, ownerId: string) {
    this.tasksCompletedTotal.inc({ organization_id: organizationId, owner_id: ownerId });
  }

  incrementAiRequests(provider: string, model: string, operation: string, status: 'success' | 'error') {
    this.aiRequestsTotal.inc({ provider, model, operation, status });
  }

  observeAiRequestDuration(provider: string, operation: string, durationSeconds: number) {
    this.aiRequestDuration.observe({ provider, operation }, durationSeconds);
  }

  incrementQueueJobs(queue: string, status: 'completed' | 'failed') {
    this.queueJobsTotal.inc({ queue, status });
  }

  observeQueueJobDuration(queue: string, durationSeconds: number) {
    this.queueJobDuration.observe({ queue }, durationSeconds);
  }

  setActiveUsers(organizationId: string, count: number) {
    this.activeUsers.set({ organization_id: organizationId }, count);
  }

  // Registry access for Prometheus scraping
  getRegistry(): Registry {
    return this.registry;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  async getContentType(): Promise<string> {
    return this.registry.contentType;
  }
}