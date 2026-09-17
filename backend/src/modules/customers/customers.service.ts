import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto, CustomerSortBy, SortOrder } from './dto/customer-query.dto';
import { PaginatedCustomersDto } from './dto/paginated-customers.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto, orgContext: OrgContext): Promise<Customer> {
    const customer = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
    });
    return this.repo.save(customer);
  }

  async findAll(query: CustomerQueryDto, orgContext: OrgContext): Promise<PaginatedCustomersDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Customer> {
    const customer = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    this.checkAccess(customer, orgContext);
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto, orgContext: OrgContext): Promise<Customer> {
    const customer = await this.findById(id, orgContext);
    this.checkAccess(customer, orgContext);
    Object.assign(customer, dto);
    return this.repo.save(customer);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const customer = await this.findById(id, orgContext);
    this.checkAccess(customer, orgContext);
    await this.repo.remove(customer);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Customer> {
    return this.repo
      .createQueryBuilder('customer')
      .where('customer.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Customer>, query: CustomerQueryDto): void {
    if (query.search) {
      qb.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
  }

  private applySorting(qb: SelectQueryBuilder<Customer>, query: CustomerQueryDto): void {
    const sortBy = query.sortBy ?? CustomerSortBy.CREATED_AT;
    const sortOrder = query.sortOrder ?? SortOrder.DESC;
    qb.orderBy(`customer.${sortBy}`, sortOrder);
  }

  private async paginate(
    qb: SelectQueryBuilder<Customer>,
    query: CustomerQueryDto,
  ): Promise<PaginatedCustomersDto> {
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

  private checkAccess(customer: Customer, orgContext: OrgContext): void {
    if (orgContext.restrictedToOwnRecords) {
      return;
    }
  }
}