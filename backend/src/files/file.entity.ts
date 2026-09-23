import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FileResourceType {
  PROPERTY_IMAGE = 'PROPERTY_IMAGE',
  LEAD_DOCUMENT = 'LEAD_DOCUMENT',
  DEAL_DOCUMENT = 'DEAL_DOCUMENT',
  CUSTOMER_DOCUMENT = 'CUSTOMER_DOCUMENT',
  GENERAL = 'GENERAL',
}

export enum FileStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  READY = 'READY',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

@Entity('files')
@Index('idx_file_org', ['organizationId'])
@Index('idx_file_resource', ['resourceType', 'resourceId'])
@Index('idx_file_uploader', ['uploadedBy'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'uploaded_by', type: 'uuid' })
  uploadedBy: string;

  @Column({ name: 'resource_type', type: 'enum', enum: FileResourceType })
  resourceType: FileResourceType;

  @Column({ name: 'resource_id', type: 'uuid', nullable: true })
  resourceId: string | null;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes: number;

  @Column({ name: 'storage_key', type: 'varchar', length: 512 })
  storageKey: string;

  @Column({ name: 'url', type: 'varchar', length: 1024, nullable: true })
  url: string | null;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 1024, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'status', type: 'enum', enum: FileStatus, default: FileStatus.PENDING })
  status: FileStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
