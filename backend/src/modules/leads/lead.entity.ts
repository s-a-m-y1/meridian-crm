import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED',
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  WALK_IN = 'WALK_IN',
  OTHER = 'OTHER',
}

export enum LeadClassification {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}

@Entity('leads')
@Index('idx_leads_org', ['organizationId'])
@Index('idx_leads_owner', ['ownerId'])
@Index('idx_leads_customer', ['customerId'])
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string | null;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({ type: 'varchar', length: 20, default: 'NEW' })
  status: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  source: string | null;

  @Column({ name: 'budget_min', type: 'numeric', precision: 12, scale: 2, nullable: true })
  budgetMin: string | null;

  @Column({ name: 'budget_max', type: 'numeric', precision: 12, scale: 2, nullable: true })
  budgetMax: string | null;

  @Column({ name: 'requested_property_type', type: 'varchar', length: 50, nullable: true })
  requestedPropertyType: string | null;

  @Column({ name: 'requested_location', type: 'varchar', length: 120, nullable: true })
  requestedLocation: string | null;

  @Column({ name: 'search_vector', type: 'tsvector', nullable: true, select: false })
  searchVector: string | null;

  @Column({ name: 'ai_score', type: 'int', nullable: true })
  aiScore: number | null;

  @Column({ name: 'ai_classification', type: 'varchar', length: 10, nullable: true })
  aiClassification: string | null;

  @Column({ name: 'ai_score_reasons', type: 'jsonb', nullable: true })
  aiScoreReasons: string[] | null;

  @Column({ name: 'ai_scored_at', type: 'timestamptz', nullable: true })
  aiScoredAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}