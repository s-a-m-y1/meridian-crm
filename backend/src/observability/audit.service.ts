import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ROLE_CHANGE = 'ROLE_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  AI_CHAT = 'AI_CHAT',
  AI_TOOL_USE = 'AI_TOOL_USE',
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('audit_logs')
@Index('idx_audit_org', ['organizationId'])
@Index('idx_audit_user', ['userId'])
@Index('idx_audit_action', ['action'])
@Index('idx_audit_entity', ['entityType', 'entityId'])
@Index('idx_audit_created', ['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 20 })
  severity: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 100, nullable: true })
  entityType: string | null;

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId: string | null;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: Record<string, unknown> | null;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: Record<string, unknown> | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ type: 'boolean', default: false })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

export interface AuditLogEntry {
  organizationId: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  action: AuditAction;
  severity?: AuditSeverity;
  entityType?: string | null;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  success?: boolean;
  errorMessage?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
    private readonly configService: ConfigService,
  ) {}

  async log(entry: AuditLogEntry): Promise<AuditLog> {
    const auditLog = this.auditRepo.create({
      organizationId: entry.organizationId,
      userId: entry.userId ?? null,
      ipAddress: entry.ipAddress ?? null,
      userAgent: entry.userAgent ?? null,
      action: entry.action,
      severity: entry.severity ?? AuditSeverity.LOW,
      entityType: entry.entityType ?? null,
      entityId: entry.entityId ?? null,
      oldValues: entry.oldValues ?? null,
      newValues: entry.newValues ?? null,
      metadata: entry.metadata ?? null,
      success: entry.success ?? true,
      errorMessage: entry.errorMessage ?? null,
    });

    const saved = await this.auditRepo.save(auditLog);

    // Also log to Winston for immediate visibility
    this.logger.log(`AUDIT: ${entry.action} | Org: ${entry.organizationId} | User: ${entry.userId} | Entity: ${entry.entityType}:${entry.entityId} | Success: ${entry.success ?? true}`, 'AuditService');

    return saved;
  }

  async logCreate(organizationId: string, userId: string | null, entityType: string, entityId: string, newValues: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.CREATE,
      severity: AuditSeverity.LOW,
      entityType,
      entityId,
      newValues,
      success: true,
    });
  }

  async logUpdate(organizationId: string, userId: string | null, entityType: string, entityId: string, oldValues: Record<string, unknown>, newValues: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.UPDATE,
      severity: AuditSeverity.MEDIUM,
      entityType,
      entityId,
      oldValues,
      newValues,
      success: true,
    });
  }

  async logDelete(organizationId: string, userId: string | null, entityType: string, entityId: string, oldValues: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.DELETE,
      severity: AuditSeverity.HIGH,
      entityType,
      entityId,
      oldValues,
      success: true,
    });
  }

  async logRead(organizationId: string, userId: string | null, entityType: string, entityId: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.READ,
      severity: AuditSeverity.LOW,
      entityType,
      entityId,
      success: true,
    });
  }

  async logLogin(organizationId: string, userId: string, success: boolean, ipAddress?: string, userAgent?: string, errorMessage?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
      severity: success ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      success,
      errorMessage,
    });
  }

  async logLogout(organizationId: string, userId: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.LOGOUT,
      severity: AuditSeverity.LOW,
      success: true,
    });
  }

  async logPasswordChange(organizationId: string, userId: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.PASSWORD_CHANGE,
      severity: AuditSeverity.HIGH,
      success: true,
    });
  }

  async logRoleChange(organizationId: string, actorId: string, targetUserId: string, oldRole: string, newRole: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId: actorId,
      ipAddress,
      userAgent,
      action: AuditAction.ROLE_CHANGE,
      severity: AuditSeverity.HIGH,
      entityType: 'user',
      entityId: targetUserId,
      oldValues: { role: oldRole },
      newValues: { role: newRole },
      success: true,
    });
  }

  async logExport(organizationId: string, userId: string, entityType: string, filters: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.EXPORT,
      severity: AuditSeverity.HIGH,
      entityType,
      metadata: { filters },
      success: true,
    });
  }

  async logAiChat(organizationId: string, userId: string, conversationId: string, messageLength: number, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      ipAddress,
      userAgent,
      action: AuditAction.AI_CHAT,
      severity: AuditSeverity.LOW,
      entityType: 'ai_conversation',
      entityId: conversationId,
      metadata: { messageLength },
      success: true,
    });
  }

  async logAiToolUse(organizationId: string, userId: string, toolName: string, entityType: string | null, entityId: string | null, success: boolean, errorMessage?: string): Promise<AuditLog> {
    return this.log({
      organizationId,
      userId,
      action: AuditAction.AI_TOOL_USE,
      severity: success ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      entityType,
      entityId,
      metadata: { toolName },
      success,
      errorMessage,
    });
  }

  async getAuditLogs(
    organizationId: string,
    options: {
      userId?: string;
      action?: AuditAction;
      entityType?: string;
      entityId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ data: AuditLog[]; total: number }> {
    const qb = this.auditRepo.createQueryBuilder('audit')
      .where('audit.organizationId = :orgId', { orgId: organizationId });

    if (options.userId) {
      qb.andWhere('audit.userId = :userId', { userId: options.userId });
    }
    if (options.action) {
      qb.andWhere('audit.action = :action', { action: options.action });
    }
    if (options.entityType) {
      qb.andWhere('audit.entityType = :entityType', { entityType: options.entityType });
    }
    if (options.entityId) {
      qb.andWhere('audit.entityId = :entityId', { entityId: options.entityId });
    }
    if (options.startDate) {
      qb.andWhere('audit.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options.endDate) {
      qb.andWhere('audit.createdAt <= :endDate', { endDate: options.endDate });
    }

    qb.orderBy('audit.createdAt', 'DESC');

    const limit = options.limit ?? 100;
    const offset = options.offset ?? 0;
    qb.take(limit).skip(offset);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getAuditStats(organizationId: string, startDate?: Date, endDate?: Date): Promise<Record<string, number>> {
    const qb = this.auditRepo.createQueryBuilder('audit')
      .where('audit.organizationId = :orgId', { orgId: organizationId });

    if (startDate) qb.andWhere('audit.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('audit.createdAt <= :endDate', { endDate });

    const stats = await qb
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    return stats.reduce((acc, row) => {
      acc[row.action] = parseInt(row.count, 10);
      return acc;
    }, {} as Record<string, number>);
  }

  async cleanupOldLogs(retentionDays = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.auditRepo
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Cleaned up ${result.affected} audit logs older than ${retentionDays} days`);
    return result.affected ?? 0;
  }
}