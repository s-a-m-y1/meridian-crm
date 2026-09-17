import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { User } from '../../modules/users/user.entity';

export interface AuthedUser {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: Date | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'] as User | undefined;
    if (!user) throw new Error('CurrentUser decorator used without AuthGuard');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  },
);