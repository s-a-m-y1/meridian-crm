import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { PaginatedTasksDto } from './dto/paginated-tasks.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, orgContext: OrgContext): Promise<Task> {
    // Parse dueAt from string to Date
    let dueAt: Date | undefined;
    if (dto.dueAt) {
      const parsed = new Date(dto.dueAt);
      if (!isNaN(parsed.getTime())) {
        dueAt = parsed;
      }
    }
    
    const task = this.repo.create({
      ...dto,
      dueAt,
      organizationId: orgContext.organizationId,
      ownerId: orgContext.userId,
      status: dto.status ?? 'PENDING',
    });
    return this.repo.save(task);
  }

  async findAll(query: TaskQueryDto, orgContext: OrgContext): Promise<PaginatedTasksDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!task) throw new NotFoundException('Task not found');
    this.checkAccess(task, orgContext);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, orgContext: OrgContext): Promise<Task> {
    const task = await this.findById(id, orgContext);
    this.checkAccess(task, orgContext);
    
    // Parse dueAt if provided
    let dueAt: Date | undefined;
    if (dto.dueAt) {
      const parsed = new Date(dto.dueAt);
      if (!isNaN(parsed.getTime())) {
        dueAt = parsed;
      }
    }
    
    Object.assign(task, dto);
    if (dueAt) {
      task.dueAt = dueAt;
    }
    if (dto.status === 'COMPLETED' && !task.completedAt) {
      task.completedAt = new Date();
    }
    return this.repo.save(task);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const task = await this.findById(id, orgContext);
    this.checkAccess(task, orgContext);
    await this.repo.remove(task);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Task> {
    return this.repo
      .createQueryBuilder('task')
      .where('task.organizationId = :orgId', { orgId: orgContext.organizationId })
      .andWhere('task.ownerId = :ownerId', { ownerId: orgContext.userId });
  }

  private applyFilters(qb: SelectQueryBuilder<Task>, query: TaskQueryDto): void {
    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }
    if (query.leadId) {
      qb.andWhere('task.leadId = :leadId', { leadId: query.leadId });
    }
    if (query.search) {
      qb.andWhere('task.title ILIKE :search', { search: `%${query.search}%` });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Task>, query: TaskQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    qb.orderBy(`task.${sortBy}`, sortOrder as 'ASC' | 'DESC');
  }

  private async paginate(qb: SelectQueryBuilder<Task>, query: TaskQueryDto): Promise<PaginatedTasksDto> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private checkAccess(task: Task, orgContext: OrgContext): void {
    if (orgContext.restrictedToOwnRecords && task.ownerId !== orgContext.userId) {
      throw new ForbiddenException('Access denied to this task');
    }
  }
}
