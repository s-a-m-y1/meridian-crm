import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { Customer } from '../../modules/customers/customer.entity';
import { Property } from '../../modules/properties/property.entity';
import { Deal } from '../../modules/deals/deal.entity';
import { Task } from '../../modules/tasks/task.entity';
import { User } from '../../modules/users/user.entity';
import { Organization } from '../../modules/organizations/organization.entity';

@Injectable()
export class AIContextService {
  private readonly logger = new Logger(AIContextService.name);

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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async buildContext(organizationId: string, userId: string): Promise<any> {
    const [organization, user, leads, deals, properties, tasks] = await Promise.all([
      this.orgRepo.findOne({ where: { id: organizationId } }),
      this.userRepo.findOne({ where: { id: userId } }),
      this.leadRepo.find({
        where: { organizationId },
        take: 50,
        order: { createdAt: 'DESC' },
      }),
      this.dealRepo.find({
        where: { organizationId },
        take: 20,
        order: { createdAt: 'DESC' },
      }),
      this.propertyRepo.find({
        where: { organizationId, status: 'available' },
        take: 20,
      }),
      this.taskRepo.find({
        where: { organizationId, completed: false },
        take: 20,
        order: { dueAt: 'ASC' },
      }),
    ]);

    return {
      organization,
      user,
      leads: leads?.map(this.sanitizeLead) ?? [],
      deals: deals?.map(this.sanitizeDeal) ?? [],
      properties: properties?.map(this.sanitizeProperty) ?? [],
      tasks: tasks?.map(this.sanitizeTask) ?? [],
    };
  }

  async getLeadContext(organizationId: string, leadId: string): Promise<any> {
    const lead = await this.leadRepo.findOne({
      where: { id: leadId, organizationId },
      relations: ['customer', 'owner', 'property', 'activities', 'tasks', 'deals'],
    });
    return lead;
  }

  async getDealContext(organizationId: string, dealId: string): Promise<any> {
    const deal = await this.dealRepo.findOne({
      where: { id: dealId, organizationId },
      relations: ['lead', 'property', 'owner', 'activities'],
    });
    return deal;
  }

  async getPropertyContext(organizationId: string, propertyId: string): Promise<any> {
    const property = await this.propertyRepo.findOne({
      where: { id: propertyId, organizationId },
    });
    return property;
  }

  private sanitizeLead(lead: any) {
    return {
      id: lead.id,
      status: lead.status,
      source: lead.source,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      requestedPropertyType: lead.requestedPropertyType,
      requestedLocation: lead.requestedLocation,
      aiScore: lead.aiScore,
      aiClassification: lead.aiClassification,
    };
  }

  private sanitizeDeal(deal: any) {
    return {
      id: deal.id,
      value: deal.value,
      stage: deal.stage,
      closedAt: deal.closedAt,
      aiCloseProbability: deal.aiCloseProbability,
    };
  }

  private sanitizeProperty(property: any) {
    return {
      id: property.id,
      name: property.name,
      category: property.category,
      price: property.price,
      bedrooms: property.bedrooms,
      location: property.location,
      status: property.status,
    };
  }

  private sanitizeTask(task: any) {
    return {
      id: task.id,
      title: task.title,
      dueAt: task.dueAt,
      status: task.status,
      completed: task.completed,
    };
  }
}