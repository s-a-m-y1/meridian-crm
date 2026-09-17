import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Deal } from './deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { PaginatedDealsDto } from './dto/paginated-deals.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly repo: Repository<Deal>,
  ) {}

  async create(dto: CreateDealDto, orgContext: OrgContext): Promise<Deal> {
    const deal = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
      ownerId: orgContext.userId,
      value: dto.value.toString(),
      stage: dto.stage ?? 'PROSPECTING',
    });
    return this.repo.save(deal);
  }

  async findAll(query: DealQueryDto, orgContext: OrgContext): Promise<PaginatedDealsDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Deal> {
    const deal = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!deal) throw new NotFoundException('Deal not found');
    this.checkAccess(deal, orgContext);
    return deal;
  }

  async update(id: string, dto: UpdateDealDto, orgContext: OrgContext): Promise<Deal> {
    const deal = await this.findById(id, orgContext);
    this.checkAccess(deal, orgContext);
    Object.assign(deal, {
      ...dto,
      value: dto.value?.toString(),
    });
    return this.repo.save(deal);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const deal = await this.findById(id, orgContext);
    this.checkAccess(deal, orgContext);
    await this.repo.remove(deal);
  }

  // AI methods
  async updateAiForecast(
    id: string,
    probability: number,
    orgContext: OrgContext,
  ): Promise<Deal> {
    const deal = await this.findById(id, orgContext);
    deal.aiCloseProbability = probability;
    deal.aiForecastUpdatedAt = new Date();
    return this.repo.save(deal);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Deal> {
    return this.repo
      .createQueryBuilder('deal')
      .where('deal.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Deal>, query: DealQueryDto): void {
    if (query.leadId) {
      qb.andWhere('deal.leadId = :leadId', { leadId: query.leadId });
    }
    if (query.propertyId) {
      qb.andWhere('deal.propertyId = :propertyId', { propertyId: query.propertyId });
    }
    if (query.ownerId) {
      qb.andWhere('deal.ownerId = :ownerId', { ownerId: query.ownerId });
    }
    if (query.stage) {
      qb.andWhere('deal.stage = :stage', { stage: query.stage });
    }
    if (query.valueMin !== undefined) {
      qb.andWhere('deal.value >= :valueMin', { valueMin: query.valueMin });
    }
    if (query.valueMax !== undefined) {
      qb.andWhere('deal.value <= :valueMax', { valueMax: query.valueMax });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Deal>, query: DealQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    qb.orderBy(`deal.${sortBy}`, sortOrder as 'ASC' | 'DESC');
  }

  private async paginate(
    qb: SelectQueryBuilder<Deal>,
    query: DealQueryDto,
  ): Promise<PaginatedDealsDto> {
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

  private checkAccess(deal: Deal, orgContext: OrgContext): void {
    if (orgContext.restrictedToOwnRecords && deal.ownerId !== orgContext.userId) {
      throw new ForbiddenException('Access denied to this deal');
    }
  }
}