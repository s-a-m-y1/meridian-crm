import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto, LeadSortBy, SortOrder } from './dto/lead-query.dto';
import { PaginatedLeadsDto } from './dto/paginated-leads.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
  ) {}

  async create(dto: CreateLeadDto, orgContext: OrgContext): Promise<Lead> {
    const lead = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
      ownerId: orgContext.userId,
      status: dto.status ?? 'NEW',
      budgetMin: dto.budgetMin?.toString(),
      budgetMax: dto.budgetMax?.toString(),
    });
    return this.repo.save(lead);
  }

  async findAll(query: LeadQueryDto, orgContext: OrgContext): Promise<PaginatedLeadsDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Lead> {
    const lead = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, orgContext);
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, orgContext: OrgContext): Promise<Lead> {
    const lead = await this.findById(id, orgContext);
    this.checkAccess(lead, orgContext);
    Object.assign(lead, {
      ...dto,
      budgetMin: dto.budgetMin?.toString(),
      budgetMax: dto.budgetMax?.toString(),
    });
    return this.repo.save(lead);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const lead = await this.findById(id, orgContext);
    this.checkAccess(lead, orgContext);
    await this.repo.remove(lead);
  }

  // AI methods
  async updateAiScore(
    id: string,
    score: number,
    classification: string,
    reasons: string[],
    orgContext: OrgContext,
  ): Promise<Lead> {
    const lead = await this.findById(id, orgContext);
    lead.aiScore = score;
    lead.aiClassification = classification;
    lead.aiScoreReasons = reasons;
    lead.aiScoredAt = new Date();
    return this.repo.save(lead);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Lead> {
    return this.repo
      .createQueryBuilder('lead')
      .where('lead.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Lead>, query: LeadQueryDto): void {
    if (query.search) {
      qb.andWhere(
        '(lead.searchVector @@ plainto_tsquery(:search) OR lead.requestedLocation ILIKE :search OR lead.requestedPropertyType ILIKE :search)',
        { search: query.search },
      );
    }
    if (query.status) {
      qb.andWhere('lead.status = :status', { status: query.status });
    }
    if (query.source) {
      qb.andWhere('lead.source = :source', { source: query.source });
    }
    if (query.customerId) {
      qb.andWhere('lead.customerId = :customerId', { customerId: query.customerId });
    }
    if (query.ownerId) {
      qb.andWhere('lead.ownerId = :ownerId', { ownerId: query.ownerId });
    }
    if (query.budgetMin !== undefined) {
      qb.andWhere('lead.budgetMin >= :budgetMin', { budgetMin: query.budgetMin });
    }
    if (query.budgetMax !== undefined) {
      qb.andWhere('lead.budgetMax <= :budgetMax', { budgetMax: query.budgetMax });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Lead>, query: LeadQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    qb.orderBy(`lead.${sortBy}`, sortOrder);
  }

  private async paginate(
    qb: SelectQueryBuilder<Lead>,
    query: LeadQueryDto,
  ): Promise<PaginatedLeadsDto> {
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

  private checkAccess(lead: Lead, orgContext: OrgContext): void {
    if (orgContext.restrictedToOwnRecords && lead.ownerId !== orgContext.userId) {
      throw new ForbiddenException('Access denied to this lead');
    }
  }
}