import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { PaginatedActivitiesDto } from './dto/paginated-activities.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly repo: Repository<Activity>,
  ) {}

  async create(dto: CreateActivityDto, orgContext: OrgContext): Promise<Activity> {
    const activity = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
      userId: orgContext.userId,
    });
    return this.repo.save(activity);
  }

  async findAll(query: ActivityQueryDto, orgContext: OrgContext): Promise<PaginatedActivitiesDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Activity> {
    const activity = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!activity) throw new NotFoundException('Activity not found');
    this.checkAccess(activity, orgContext);
    return activity;
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const activity = await this.findById(id, orgContext);
    this.checkAccess(activity, orgContext);
    await this.repo.remove(activity);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Activity> {
    return this.repo
      .createQueryBuilder('activity')
      .where('activity.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Activity>, query: ActivityQueryDto): void {
    if (query.leadId) {
      qb.andWhere('activity.leadId = :leadId', { leadId: query.leadId });
    }
    if (query.type) {
      qb.andWhere('activity.type = :type', { type: query.type });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Activity>, query: ActivityQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';
    qb.orderBy(`activity.${sortBy}`, sortOrder);
  }

  private async paginate(
    qb: SelectQueryBuilder<Activity>,
    query: ActivityQueryDto,
  ): Promise<PaginatedActivitiesDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  private checkAccess(activity: Activity, orgContext: OrgContext): void {
    return;
  }
}