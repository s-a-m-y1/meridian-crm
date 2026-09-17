import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Required minimum role for the endpoint. Evaluated against the
 * organization context established by OrganizationMemberGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
