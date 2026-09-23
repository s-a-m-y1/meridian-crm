import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { Customer } from '../../modules/customers/customer.entity';
import { Property } from '../../modules/properties/property.entity';
import { Deal } from '../../modules/deals/deal.entity';
import { Task } from '../../modules/tasks/task.entity';
import { Activity } from '../../modules/activities/activity.entity';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class AIToolsService {
  private readonly logger = new Logger(AIToolsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async getLead(auth: OrgContext, leadId: string): Promise<any> {
    const lead = await this.leadRepo.findOne({
      where: { id: leadId, organizationId: auth.organizationId },
      relations: ['customer', 'owner', 'property'],
    });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, auth);
    return { success: true, data: this.sanitizeLead(lead) };
  }

  async searchLeads(
    auth: OrgContext,
    filters: { status?: string; search?: string; ownerId?: string; page?: number; limit?: number },
  ): Promise<any> {
    const qb = this.leadRepo.createQueryBuilder('lead')
      .where('lead.organizationId = :orgId', { orgId: auth.organizationId });

    this.applyLeadFilters(qb, filters, auth);
    
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    qb.skip((page - 1) * limit).take(limit);
    
    const [data, total] = await qb.getManyAndCount();
    return {
      success: true,
      data: {
        data: data.map((l) => this.sanitizeLead(l)),
        total,
        page,
        limit,
      },
    };
  }

  async getCustomer(auth: OrgContext, customerId: string): Promise<any> {
    const customer = await this.customerRepo.findOne({
      where: { id: customerId, organizationId: auth.organizationId },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    this.checkAccess(customer, auth);
    return { success: true, data: this.sanitizeCustomer(customer) };
  }

  async searchCustomers(
    auth: OrgContext,
    filters: { search?: string; page?: number; limit?: number },
  ): Promise<any> {
    const qb = this.customerRepo.createQueryBuilder('customer')
      .where('customer.organizationId = :orgId', { orgId: auth.organizationId });

    if (filters.search) {
      qb.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { success: true, data: { data, total, page, limit } };
  }

  async getProperty(auth: OrgContext, propertyId: string): Promise<any> {
    const property = await this.propertyRepo.findOne({
      where: { id: propertyId, organizationId: auth.organizationId },
    });
    if (!property) throw new NotFoundException('Property not found');
    return { success: true, data: this.sanitizeProperty(property) };
  }

  async searchProperties(
    auth: OrgContext,
    filters: { status?: string; category?: string; location?: string; priceMin?: number; priceMax?: number; page?: number; limit?: number },
  ): Promise<any> {
    const qb = this.propertyRepo.createQueryBuilder('property')
      .where('property.organizationId = :orgId', { orgId: auth.organizationId });

    if (filters.status) qb.andWhere('property.status = :status', { status: filters.status });
    if (filters.category) qb.andWhere('property.category = :category', { category: filters.category });
    if (filters.location) qb.andWhere('property.location ILIKE :location', { location: `%${filters.location}%` });
    if (filters.priceMin) qb.andWhere('property.price >= :priceMin', { priceMin: filters.priceMin });
    if (filters.priceMax) qb.andWhere('property.price <= :priceMax', { priceMax: filters.priceMax });

    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { success: true, data: { data, total, page, limit } };
  }

  async getDeal(auth: OrgContext, dealId: string): Promise<any> {
    const deal = await this.dealRepo.findOne({
      where: { id: dealId, organizationId: auth.organizationId },
      relations: ['lead', 'property', 'owner'],
    });
    if (!deal) throw new NotFoundException('Deal not found');
    this.checkAccess(deal, auth);
    return { success: true, data: deal };
  }

  async getTasks(auth: OrgContext, filters: { leadId?: string; status?: string; page?: number; limit?: number }): Promise<any> {
    const qb = this.taskRepo.createQueryBuilder('task')
      .where('task.organizationId = :orgId', { orgId: auth.organizationId });

    if (filters.leadId) qb.andWhere('task.leadId = :leadId', { leadId: filters.leadId });
    if (filters.status) qb.andWhere('task.status = :status', { status: filters.status });

    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { success: true, data: { data, total, page, limit } };
  }

  async getActivities(auth: OrgContext, filters: { leadId?: string; type?: string; page?: number; limit?: number }): Promise<any> {
    const qb = this.activityRepo.createQueryBuilder('activity')
      .where('activity.organizationId = :orgId', { orgId: auth.organizationId });

    if (filters.leadId) qb.andWhere('activity.leadId = :leadId', { leadId: filters.leadId });
    if (filters.type) qb.andWhere('activity.type = :type', { type: filters.type });

    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 50, 200);
    qb.orderBy('activity.createdAt', 'DESC').skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { success: true, data: { data, total, page, limit } };
  }

  async getPipeline(auth: OrgContext): Promise<any> {
    const stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const pipeline = [];

    for (const stage of stages) {
      const count = await this.dealRepo.count({
        where: { organizationId: auth.organizationId, stage },
      });
      pipeline.push({ stage, count });
    }

    return { success: true, data: pipeline };
  }

  async getSalesMetrics(auth: OrgContext): Promise<any> {
    const totalDeals = await this.dealRepo.count({ where: { organizationId: auth.organizationId } });
    const wonDeals = await this.dealRepo.count({ where: { organizationId: auth.organizationId, stage: 'CLOSED_WON' } });
    const lostDeals = await this.dealRepo.count({ where: { organizationId: auth.organizationId, stage: 'CLOSED_LOST' } });
    const openDeals = await this.dealRepo.count({ where: { organizationId: auth.organizationId, stage: 'PROSPECTING' } });

    const totalValue = await this.dealRepo
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.organizationId = :orgId AND deal.stage = :stage', { orgId: auth.organizationId, stage: 'CLOSED_WON' })
      .getRawOne();

    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    return {
      success: true,
      data: {
        totalDeals,
        wonDeals,
        lostDeals,
        openDeals,
        totalRevenue: parseFloat(totalValue?.total ?? '0'),
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    };
  }

  async createTask(auth: OrgContext, data: { leadId: string; title: string; dueAt: Date }): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: data.leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, auth);

    const task = this.taskRepo.create({
      ...data,
      organizationId: auth.organizationId,
      ownerId: auth.userId,
    });
    await this.taskRepo.save(task);
    return { success: true, data: task };
  }

  async updateLead(auth: OrgContext, leadId: string, data: Partial<any>): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, auth);

    Object.assign(lead, data);
    await this.leadRepo.save(lead);
    return { success: true, data: this.sanitizeLead(lead) };
  }

  async assignLead(auth: OrgContext, leadId: string, newOwnerId: string): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    
    if (auth.role !== 'owner' && auth.role !== 'admin') {
      throw new ForbiddenException('Only owners and admins can reassign leads');
    }

    lead.ownerId = newOwnerId;
    await this.leadRepo.save(lead);
    return { success: true, data: this.sanitizeLead(lead) };
  }

  async createDeal(auth: OrgContext, data: { leadId: string; propertyId?: string; value: number; stage: string }): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: data.leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, auth);

    const deal = this.dealRepo.create({
      ...data,
      organizationId: auth.organizationId,
      ownerId: auth.userId,
      value: String(data.value),
      stage: data.stage ?? 'PROSPECTING',
    });
    await this.dealRepo.save(deal);
    return { success: true, data: deal };
  }

  async sendMessage(auth: OrgContext, data: { leadId: string; channel: 'email' | 'whatsapp' | 'sms'; content: string }): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: data.leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    this.checkAccess(lead, auth);

    const activity = await this.activityRepo.save({
      organizationId: auth.organizationId,
      leadId: data.leadId,
      userId: auth.userId,
      type: data.channel.toUpperCase() as any,
      content: data.content,
    });

    return { success: true, data: activity };
  }

  async deleteLead(auth: OrgContext, leadId: string): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId, organizationId: auth.organizationId } });
    if (!lead) throw new NotFoundException('Lead not found');
    if (auth.role !== 'owner' && auth.role !== 'admin') {
      throw new ForbiddenException('Only owners and admins can delete leads');
    }
    await this.leadRepo.remove(lead);
    return { success: true };
  }

  async deleteCustomer(auth: OrgContext, customerId: string): Promise<any> {
    const customer = await this.customerRepo.findOne({ where: { id: customerId, organizationId: auth.organizationId } });
    if (!customer) throw new NotFoundException('Customer not found');
    if (auth.role !== 'owner' && auth.role !== 'admin') {
      throw new ForbiddenException('Only owners and admins can delete customers');
    }
    await this.customerRepo.remove(customer);
    return { success: true };
  }

  async deleteProperty(auth: OrgContext, propertyId: string): Promise<any> {
    const property = await this.propertyRepo.findOne({ where: { id: propertyId, organizationId: auth.organizationId } });
    if (!property) throw new NotFoundException('Property not found');
    if (auth.role !== 'owner' && auth.role !== 'admin') {
      throw new ForbiddenException('Only owners and admins can delete properties');
    }
    await this.propertyRepo.remove(property);
    return { success: true };
  }

  async removeUser(auth: OrgContext, userId: string): Promise<any> {
    if (auth.role !== 'owner') {
      throw new ForbiddenException('Only owners can remove users');
    }
    return { success: true };
  }

  getAllowedTools(role: string, restrictedToOwnRecords: boolean): any[] {
    // Return tool definitions based on role and permissions
    const allTools = [
      { name: 'get_lead', type: 'read' },
      { name: 'search_leads', type: 'read' },
      { name: 'get_customer', type: 'read' },
      { name: 'search_customers', type: 'read' },
      { name: 'get_property', type: 'read' },
      { name: 'search_properties', type: 'read' },
      { name: 'get_deal', type: 'read' },
      { name: 'get_tasks', type: 'read' },
      { name: 'get_activities', type: 'read' },
      { name: 'get_pipeline', type: 'read' },
      { name: 'get_sales_metrics', type: 'read' },
      { name: 'create_task', type: 'write' },
      { name: 'update_lead', type: 'write' },
      { name: 'assign_lead', type: 'write' },
      { name: 'create_deal', type: 'write' },
      { name: 'send_message', type: 'write' },
      { name: 'delete_lead', type: 'destructive' },
      { name: 'delete_customer', type: 'destructive' },
      { name: 'delete_property', type: 'destructive' },
      { name: 'remove_user', type: 'destructive' },
    ];

    // Filter based on role
    const rolePermissions: Record<string, string[]> = {
      owner: allTools.map(t => t.name),
      admin: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline', 'get_sales_metrics', 'create_task', 'update_lead', 'assign_lead', 'create_deal', 'send_message', 'delete_lead', 'delete_customer', 'delete_property', 'remove_user'],
      manager: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline', 'get_sales_metrics', 'create_task', 'update_lead', 'assign_lead', 'create_deal', 'send_message'],
      agent: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline', 'create_task', 'update_lead', 'create_deal', 'send_message'],
    };

    const allowedToolNames = rolePermissions[role] || rolePermissions.agent;
    return allTools.filter(t => allowedToolNames.includes(t.name));
  }

  private applyLeadFilters(qb: any, filters: any, auth: OrgContext): void {
    if (filters.status) qb.andWhere('lead.status = :status', { status: filters.status });
    if (filters.ownerId) qb.andWhere('lead.ownerId = :ownerId', { ownerId: filters.ownerId });
    if (filters.search) {
      qb.andWhere(
        '(lead.name ILIKE :search OR lead.email ILIKE :search OR lead.requestedLocation ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (auth.restrictedToOwnRecords) {
      qb.andWhere('lead.ownerId = :userId', { userId: auth.userId });
    }
  }

  private checkAccess(entity: { ownerId?: string; userId?: string; organizationId: string }, auth: OrgContext): void {
    if (entity.organizationId !== auth.organizationId) {
      throw new ForbiddenException('Access denied: different organization');
    }
    if (auth.restrictedToOwnRecords && (entity.ownerId || entity.userId) !== auth.userId) {
      throw new ForbiddenException('Access denied: restricted to own records');
    }
  }

  private sanitizeLead(lead: Lead) {
    return {
      id: lead.id,
      organizationId: lead.organizationId,
      customerId: lead.customerId,
      ownerId: lead.ownerId,
      status: lead.status,
      source: lead.source,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      requestedPropertyType: lead.requestedPropertyType,
      requestedLocation: lead.requestedLocation,
      aiScore: lead.aiScore,
      aiClassification: lead.aiClassification,
      aiScoreReasons: lead.aiScoreReasons,
      aiScoredAt: lead.aiScoredAt,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  private sanitizeCustomer(customer: Customer) {
    return {
      id: customer.id,
      organizationId: customer.organizationId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private sanitizeProperty(property: Property) {
    return {
      id: property.id,
      organizationId: property.organizationId,
      name: property.name,
      description: property.description,
      category: property.category,
      price: property.price,
      bedrooms: property.bedrooms,
      location: property.location,
      status: property.status,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}
