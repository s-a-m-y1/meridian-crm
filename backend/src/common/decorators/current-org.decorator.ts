import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { OrgContext } from './org-context.interface';

export const CurrentOrg = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): OrgContext | undefined => {
    const request = ctx.switchToHttp().getRequest<Request & { orgContext?: OrgContext }>();
    return request.orgContext;
  },
);