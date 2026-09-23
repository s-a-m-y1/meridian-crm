import { Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingService implements LoggerService, OnModuleInit {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeLogger();
  }

  private initializeLogger() {
    const logLevel = this.configService.get<string>('LOG_LEVEL') ?? 'info';
    const logDir = this.configService.get<string>('LOG_DIR') ?? './logs';

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
        let log = `${timestamp} [${level}]`;
        if (context) log += ` [${context}]`;
        log += `: ${message}`;
        if (trace) log += `\n${trace}`;
        if (Object.keys(meta).length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;
        return log;
      }),
    );

    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    );

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: consoleFormat,
        level: logLevel,
      }),
    ];

    // Daily rotating file for all logs
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/application-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
        level: logLevel,
      }),
    );

    // Daily rotating file for errors only
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: fileFormat,
        level: 'error',
      }),
    );

    // Daily rotating file for audit logs
    transports.push(
      new DailyRotateFile({
        filename: `${logDir}/audit-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '90d',
        format: fileFormat,
        level: 'info',
      }),
    );

    this.logger = winston.createLogger({
      level: logLevel,
      transports,
      exitOnError: false,
    });
  }

  log(message: string, context?: string, meta?: Record<string, unknown>) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>) {
    this.logger.error(message, { context, trace, ...meta });
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: Record<string, unknown>) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Structured logging methods
  logHttpRequest(data: {
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    userId?: string;
    organizationId?: string;
    ip?: string;
    userAgent?: string;
  }) {
    this.logger.info('HTTP Request', {
      type: 'http_request',
      ...data,
    });
  }

  logBusinessEvent(data: {
    event: string;
    organizationId: string;
    userId?: string;
    entityType?: string;
    entityId?: string;
    details?: Record<string, unknown>;
  }) {
    this.logger.info('Business Event', {
      type: 'business_event',
      ...data,
    });
  }

  logSecurityEvent(data: {
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    organizationId?: string;
    userId?: string;
    ip?: string;
    details?: Record<string, unknown>;
  }) {
    this.logger.warn('Security Event', {
      type: 'security_event',
      ...data,
    });
  }

  logAiOperation(data: {
    provider: string;
    model: string;
    operation: string;
    duration: number;
    tokens?: { prompt: number; completion: number; total: number };
    status: 'success' | 'error';
    error?: string;
  }) {
    this.logger.info('AI Operation', {
      type: 'ai_operation',
      ...data,
    });
  }

  logQueueJob(data: {
    queue: string;
    jobId: string;
    status: 'started' | 'completed' | 'failed' | 'retrying';
    duration?: number;
    error?: string;
    attempts?: number;
  }) {
    this.logger.info('Queue Job', {
      type: 'queue_job',
      ...data,
    });
  }

  getLogger(): winston.Logger {
    return this.logger;
  }
}