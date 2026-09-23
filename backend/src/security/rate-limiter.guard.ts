import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly logger = new Logger(RateLimiterGuard.name);
  private readonly store = new Map<string, RateLimitEntry>();

  constructor(private readonly configService: ConfigService) {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.getKey(request);
    const limit = this.getLimit(request);
    const windowMs = this.getWindowMs(request);

    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      this.logger.warn(`Rate limit exceeded for ${key}`);
      throw new HttpException(
        {
          message: 'Too many requests',
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    entry.count++;
    return true;
  }

  private getKey(request: Request): string {
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    const path = request.path;
    return `${ip}:${path}:${userAgent.substring(0, 50)}`;
  }

  private getLimit(request: Request): number {
    if (request.path.startsWith('/auth/login') || request.path.startsWith('/auth/register')) {
      return this.configService.get<number>('throttle.authLimit') ?? 10;
    }
    if (request.path.startsWith('/ai/')) {
      return this.configService.get<number>('throttle.aiLimit') ?? 30;
    }
    return this.configService.get<number>('throttle.limit') ?? 300;
  }

  private getWindowMs(request: Request): number {
    if (request.path.startsWith('/auth/')) {
      return this.configService.get<number>('throttle.authTtlMs') ?? 60000;
    }
    return this.configService.get<number>('throttle.ttlMs') ?? 60000;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Manual reset for testing or admin
  reset(key: string): void {
    this.store.delete(key);
  }
}