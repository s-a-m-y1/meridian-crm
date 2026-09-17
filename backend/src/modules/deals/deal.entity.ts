import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DealStage {
  PROSPECTING = 'PROSPECTING',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

@Entity('deals')
@Index('idx_deals_org', ['organizationId'])
@Index('idx_deals_lead', ['leadId'])
@Index('idx_deals_owner', ['ownerId'])
@Index('idx_deals_property', ['propertyId'])
@Index('idx_deals_stage', ['stage'])
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'lead_id', type: 'uuid' })
  leadId: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({ name: 'property_id', type: 'uuid', nullable: true })
  propertyId: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  value: string;

  @Column({ type: 'varchar', length: 30, default: 'PROSPECTING' })
  stage: string;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;

  @Column({ name: 'ai_close_probability', type: 'int', nullable: true })
  aiCloseProbability: number | null;

  @Column({ name: 'ai_forecast_updated_at', type: 'timestamptz', nullable: true })
  aiForecastUpdatedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}