import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  VIEWING = 'VIEWING',
  NOTE = 'NOTE',
  WHATSAPP = 'WHATSAPP',
}

@Entity('activities')
@Index('idx_activities_org', ['organizationId'])
@Index('idx_activities_lead', ['leadId'])
@Index('idx_activities_user', ['userId'])
@Index('idx_activities_type', ['type'])
@Index('idx_activities_created', ['createdAt'])
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'lead_id', type: 'uuid' })
  leadId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}