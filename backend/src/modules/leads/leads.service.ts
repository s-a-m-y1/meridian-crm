import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Lead } from './lead.entity';
import { Customer } from '../customers/customer.entity';
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
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateLeadDto, orgContext: OrgContext): Promise<Lead> {
    // Leads link to a customer — the UI sends inline contact info
    // (name/email/phone), so create the customer first when no id is given.
    let customerId = dto.customerId;
    if (!customerId) {
      if (!dto.name || !dto.name.trim()) {
        throw new BadRequestException('Either customerId or a contact name is required');
      }
      const customer = this.customersRepo.create({
        name: dto.name.trim(),
        email: dto.email,
        phone: dto.phone,
        organizationId: orgContext.organizationId,
      });
      customerId = (await this.customersRepo.save(customer)).id;
    } else {
      const customer = await this.customersRepo.findOne({
        where: { id: customerId, organizationId: orgContext.organizationId },
      });
      if (!customer) {
        throw new BadRequestException('Customer not found in this organization');
      }
    }

    const lead = this.repo.create({
      status: dto.status ?? 'NEW',
      source: dto.source,
      customerId,
      budgetMin: dto.budgetMin?.toString(),
      budgetMax: dto.budgetMax?.toString(),
      requestedPropertyType: dto.requestedPropertyType,
      requestedLocation: dto.requestedLocation,
      organizationId: orgContext.organizationId,
      ownerId: orgContext.userId,
    });
    return this.repo.save(lead);
  }

  private withContact(lead: Lead): Lead & { name?: string; email?: string; phone?: string } {
    const customer = (lead as Lead & { customer?: Customer }).customer;
    return {
      ...lead,
      name: customer?.name ?? undefined,
      email: customer?.email ?? undefined,
      phone: customer?.phone ?? undefined,
    };
  }

  async findAll(query: LeadQueryDto, orgContext: OrgContext): Promise<PaginatedLeadsDto> {
    const qb = this.buildBaseQuery(orgContext)
      .leftJoinAndSelect('lead.customer', 'customer');
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    const result = await this.paginate(qb, query);
    return { ...result, data: result.data.map((l) => this.withContact(l)) };
  }

  async findById(id: string, orgContext: OrgContext): Promise<Lead> {
    const lead = await this.repo
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.customer', 'customer')
      .where('lead.id = :id AND lead.organizationId = :orgId', { id, orgId: orgContext.organizationId })
      .getOne();
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, orgContext);
    return this.withContact(lead) as Lead;
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