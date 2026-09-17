import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Property } from './property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyQueryDto, PropertySortBy, SortOrder } from './dto/property-query.dto';
import { PaginatedPropertiesDto } from './dto/paginated-properties.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto, orgContext: OrgContext): Promise<Property> {
    const property = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
      price: dto.price?.toString(),
      status: dto.status ?? 'AVAILABLE',
      category: dto.category ?? 'APARTMENT',
    });
    return this.repo.save(property);
  }

  async findAll(query: PropertyQueryDto, orgContext: OrgContext): Promise<PaginatedPropertiesDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Property> {
    const property = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!property) throw new NotFoundException('Property not found');
    this.checkAccess(property, orgContext);
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto, orgContext: OrgContext): Promise<Property> {
    const property = await this.findById(id, orgContext);
    this.checkAccess(property, orgContext);
    Object.assign(property, {
      ...dto,
      price: dto.price?.toString(),
    });
    return this.repo.save(property);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const property = await this.findById(id, orgContext);
    this.checkAccess(property, orgContext);
    await this.repo.remove(property);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Property> {
    return this.repo
      .createQueryBuilder('property')
      .where('property.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Property>, query: PropertyQueryDto): void {
    if (query.search) {
      qb.andWhere(
        '(property.searchVector @@ plainto_tsquery(:search) OR property.name ILIKE :search OR property.location ILIKE :search OR property.description ILIKE :search)',
        { search: query.search },
      );
    }
    if (query.status) {
      qb.andWhere('property.status = :status', { status: query.status });
    }
    if (query.category) {
      qb.andWhere('property.category = :category', { category: query.category });
    }
    if (query.location) {
      qb.andWhere('property.location ILIKE :location', { location: `%${query.location}%` });
    }
    if (query.priceMin !== undefined) {
      qb.andWhere('property.price >= :priceMin', { priceMin: query.priceMin });
    }
    if (query.priceMax !== undefined) {
      qb.andWhere('property.price <= :priceMax', { priceMax: query.priceMax });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Property>, query: PropertyQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    qb.orderBy(`property.${sortBy}`, sortOrder);
  }

  private async paginate(
    qb: SelectQueryBuilder<Property>,
    query: PropertyQueryDto,
  ): Promise<PaginatedPropertiesDto> {
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

  private checkAccess(property: Property, orgContext: OrgContext): void {
    // Properties are org-scoped; no owner restriction by default
    return;
  }
}