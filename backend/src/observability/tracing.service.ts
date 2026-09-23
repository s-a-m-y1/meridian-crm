import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { trace, SpanStatusCode, Span, Tracer, context, propagation, Context } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

@Injectable()
export class TracingService implements OnModuleInit, OnModuleDestroy {
  private tracer: Tracer;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeInstrumentations();
    this.tracer = trace.getTracer(this.configService.get<string>('OTEL_SERVICE_NAME') ?? 'crm-backend');
  }

  private initializeInstrumentations() {
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new NestInstrumentation(),
        new PgInstrumentation(),
      ],
    });
  }

  getTracer(): Tracer {
    return this.tracer;
  }

  startSpan(name: string, attributes?: Record<string, string | number | boolean>): Span {
    return this.tracer.startSpan(name, { attributes });
  }

  startActiveSpan<R>(name: string, fn: (span: Span) => R, attributes?: Record<string, string | number | boolean>): R {
    return this.tracer.startActiveSpan(name, { attributes }, fn);
  }

  // Async context propagation
  extractTraceContext(carrier: Record<string, string>): Context {
    return propagation.extract(context.active(), carrier);
  }

  injectTraceContext(carrier: Record<string, string>): void {
    propagation.inject(context.active(), carrier);
  }

  // Helper methods for common tracing patterns
  async traceAsync<T>(name: string, fn: (span: Span) => Promise<T>, attributes?: Record<string, string | number | boolean>): Promise<T> {
    return this.startActiveSpan(name, async (span) => {
      try {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        span.recordException(error as Error);
        throw error;
      }
    }, attributes);
  }

  // Database query tracing
  traceDbQuery(span: Span, query: string, params?: unknown[], durationMs?: number) {
    span.setAttribute('db.system', 'postgresql');
    span.setAttribute('db.statement', query);
    if (params) {
      span.setAttribute('db.params', JSON.stringify(params));
    }
    if (durationMs !== undefined) {
      span.setAttribute('db.duration_ms', durationMs);
    }
  }

  // HTTP request tracing
  traceHttpRequest(span: Span, method: string, url: string, statusCode: number, durationMs: number) {
    span.setAttribute('http.method', method);
    span.setAttribute('http.url', url);
    span.setAttribute('http.status_code', statusCode);
    span.setAttribute('http.duration_ms', durationMs);
  }

  // AI operation tracing
  traceAiOperation(span: Span, provider: string, model: string, operation: string, tokens?: { prompt: number; completion: number; total: number }) {
    span.setAttribute('ai.provider', provider);
    span.setAttribute('ai.model', model);
    span.setAttribute('ai.operation', operation);
    if (tokens) {
      span.setAttribute('ai.tokens.prompt', tokens.prompt);
      span.setAttribute('ai.tokens.completion', tokens.completion);
      span.setAttribute('ai.tokens.total', tokens.total);
    }
  }

  // Queue job tracing
  traceQueueJob(span: Span, queue: string, jobId: string, status: string, durationMs?: number) {
    span.setAttribute('queue.name', queue);
    span.setAttribute('queue.job_id', jobId);
    span.setAttribute('queue.job_status', status);
    if (durationMs !== undefined) {
      span.setAttribute('queue.duration_ms', durationMs);
    }
  }

  onModuleDestroy() {
    // No custom provider to shutdown
  }
}