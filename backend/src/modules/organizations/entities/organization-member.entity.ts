import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';

export type MemberRole = 'owner' | 'admin' | 'manager' | 'agent';

@Entity('organization_members')
@Unique('uq_org_user', ['organizationId', 'userId'])
@Index('idx_org_member_user', ['userId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 20 })
  role: MemberRole;

  @Column({ name: 'restricted_to_own_records', default: false })
  restrictedToOwnRecords: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}