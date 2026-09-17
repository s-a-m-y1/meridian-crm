import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('customers')
@Index('idx_customers_org', ['organizationId'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ length: 120, type: 'varchar' })
  name: string;

  @Column({ length: 30, type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ length: 255, type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'search_vector', type: 'tsvector', nullable: true, select: false })
  @Exclude()
  searchVector: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}