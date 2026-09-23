export type MemberRole = 'owner' | 'admin' | 'manager' | 'agent';

export interface OrgContext {
  organizationId: string;
  userId: string;
  role: MemberRole;
  restrictedToOwnRecords: boolean;
}

export type AuthContext = OrgContext;