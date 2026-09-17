import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { OrganizationsService } from '../../modules/organizations/organizations.service';
import type { OrgContext, MemberRole } from '../decorators/org-context.interface';

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly orgService: OrganizationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) {
      throw new UnauthorizedException();
    }

    // Resolve organization ID from header or default to first membership
    const headerOrgId = request.headers['x-organization-id'];
    const orgId = headerOrgId ? String(headerOrgId) : null;

    try {
      const membership = orgId
        ? await this.orgService.getMembership(user.id, orgId)
        : await this.orgService.getFirstMembership(user.id);

      if (!membership) {
        throw new ForbiddenException('User is not a member of this organization');
      }

      const ctx: OrgContext = {
        organizationId: membership.organizationId,
        userId: user.id,
        role: membership.role as MemberRole,
        restrictedToOwnRecords: membership.restrictedToOwnRecords,
      };
      request['orgContext'] = ctx;
      return true;
    } catch (e) {
      if (e instanceof ForbiddenException || e instanceof UnauthorizedException) throw e;
      throw new ForbiddenException('Organization context resolution failed');
    }
  }
}