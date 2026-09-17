import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Never leak stack traces or internal error details to clients
    let message: string | unknown =
      isHttp ? exception.getResponse() : 'Internal server error';
    if (!isHttp) {
      this.logger.error(
        `Unhandled error on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // Normalize validation payload shape
    if (typeof message === 'object' && message !== null) {
      const m = message as Record<string, unknown>;
      message = {
        error: m.error ?? 'Error',
        message: m.message,
        ...(Array.isArray(m.message) ? { errors: m.message } : {}),
      };
    } else {
      message = { error: 'Error', message };
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(message as Record<string, unknown>),
    });
  }
}
