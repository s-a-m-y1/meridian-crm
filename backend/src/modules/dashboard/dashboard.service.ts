import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan, Between } from 'typeorm';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';
import { Task } from '../tasks/task.entity';
import { Activity } from '../activities/activity.entity';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
import { OrganizationMember } from '../organizations/entities/organization-member.entity';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(OrganizationMember)
    private readonly orgMemberRepo: Repository<OrganizationMember>,
  ) {}

  async getStats(orgContext: OrgContext) {
    const [totalLeads, activeDeals, tasksDue, overdueTasks, meetingsToday] = await Promise.all([
      this.leadRepo.count({ where: { organizationId: orgContext.organizationId } }),
      this.dealRepo.count({ 
        where: { 
          organizationId: orgContext.organizationId,
          stage: In(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'])
        } 
      }),
      this.taskRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          completed: false,
        }
      }),
      this.taskRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          completed: false,
          dueAt: LessThan(new Date()),
        }
      }),
      this.activityRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          type: In(['VIEWING', 'MEETING']),
          createdAt: Between(
            new Date(new Date().setHours(0, 0, 0, 0)),
            new Date(new Date().setHours(23, 59, 59, 999))
          ),
        }
      }),
    ]);

    return {
      totalLeads,
      activeDeals,
      tasksDue,
      overdueTasks,
      meetingsToday,
    };
  }

  async getRecentLeads(orgContext: OrgContext, limit = 10) {
    const leads = await this.leadRepo
      .createQueryBuilder('lead')
      .leftJoin(Customer, 'customer', 'customer.id = lead.customerId')
      .addSelect(['customer.id', 'customer.name', 'customer.email', 'customer.phone'])
      .where('lead.organizationId = :orgId', { orgId: orgContext.organizationId })
      .orderBy('lead.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return leads.map(lead => {
      const customer = (lead as any).customer;
      return {
        id: lead.id,
        name: customer?.name || 'Unknown',
        email: customer?.email || '',
        phone: customer?.phone || '',
        status: lead.status,
        source: lead.source,
        budgetMin: lead.budgetMin,
        budgetMax: lead.budgetMax,
        requestedLocation: lead.requestedLocation,
        requestedPropertyType: lead.requestedPropertyType,
        aiScore: lead.aiScore,
        aiClassification: lead.aiClassification,
        customer: customer ? { name: customer.name } : null,
        createdAt: lead.createdAt,
      };
    });
  }

  async getUpcomingTasks(orgContext: OrgContext, limit = 10) {
    const tasks = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoin(Lead, 'lead', 'lead.id = task.leadId')
      .leftJoin(Customer, 'customer', 'customer.id = lead.customerId')
      .addSelect(['lead.id', 'lead.customerId', 'customer.name'])
      .where('task.organizationId = :orgId', { orgId: orgContext.organizationId })
      .andWhere('task.completed = :completed', { completed: false })
      .orderBy('task.dueAt', 'ASC')
      .take(limit)
      .getMany();

    return tasks.map(task => {
      const lead = (task as any).lead;
      const customer = lead?.customer;
      return {
        id: task.id,
        title: task.title,
        dueAt: task.dueAt,
        status: task.status,
        lead: customer ? { name: customer.name } : null,
      };
    });
  }

  async getRecentActivities(orgContext: OrgContext, limit = 10) {
    const activities = await this.activityRepo
      .createQueryBuilder('activity')
      .leftJoin(Lead, 'lead', 'lead.id = activity.leadId')
      .leftJoin(Customer, 'customer', 'customer.id = lead.customerId')
      .leftJoin(User, 'user', 'user.id = activity.userId')
      .addSelect(['lead.id', 'lead.customerId', 'customer.name', 'user.id', 'user.name'])
      .where('activity.organizationId = :orgId', { orgId: orgContext.organizationId })
      .orderBy('activity.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return activities.map(activity => {
      const lead = (activity as any).lead;
      const customer = lead?.customer;
      const user = (activity as any).user;
      return {
        id: activity.id,
        type: activity.type,
        content: activity.content,
        lead: customer ? { name: customer.name } : null,
        user: user ? { name: user.name } : null,
        createdAt: activity.createdAt,
      };
    });
  }

  async getPipeline(orgContext: OrgContext) {
    const stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const pipeline = [];

    for (const stage of stages) {
      const deals = await this.dealRepo.find({
        where: { organizationId: orgContext.organizationId, stage },
        select: ['value'],
      });
      
      const count = deals.length;
      const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value), 0);

      pipeline.push({ stage, count, totalValue });
    }

    return pipeline;
  }

  async getSalesAnalytics(orgContext: OrgContext) {
    const [totalDeals, wonDeals, lostDeals, activeDeals] = await Promise.all([
      this.dealRepo.count({ where: { organizationId: orgContext.organizationId } }),
      this.dealRepo.count({ where: { organizationId: orgContext.organizationId, stage: 'CLOSED_WON' } }),
      this.dealRepo.count({ where: { organizationId: orgContext.organizationId, stage: 'CLOSED_LOST' } }),
      this.dealRepo.count({ 
        where: { 
          organizationId: orgContext.organizationId,
          stage: In(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'])
        } 
      }),
    ]);

    const totalValue = await this.dealRepo
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.organizationId = :orgId AND deal.stage = :stage', { 
        orgId: orgContext.organizationId, 
        stage: 'CLOSED_WON' 
      })
      .getRawOne();

    const avgDealSize = await this.dealRepo
      .createQueryBuilder('deal')
      .select('AVG(deal.value)', 'avg')
      .where('deal.organizationId = :orgId AND deal.stage = :stage', { 
        orgId: orgContext.organizationId, 
        stage: 'CLOSED_WON' 
      })
      .getRawOne();

    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

    return {
      totalDeals,
      wonDeals,
      lostDeals,
      activeDeals,
      totalRevenue: parseFloat(totalValue?.total ?? '0'),
      avgDealSize: parseFloat(avgDealSize?.avg ?? '0'),
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  }

  async getConversionMetrics(orgContext: OrgContext, period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter': {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      }
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [newLeads, qualifiedLeads, convertedLeads, newDeals, wonDeals] = await Promise.all([
      this.leadRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          createdAt: MoreThan(startDate),
        }
      }),
      this.leadRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          status: In(['QUALIFIED', 'HOT', 'WARM']),
          createdAt: MoreThan(startDate),
        }
      }),
      this.leadRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          status: 'CONVERTED',
          createdAt: MoreThan(startDate),
        }
      }),
      this.dealRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          createdAt: MoreThan(startDate),
        }
      }),
      this.dealRepo.count({
        where: { 
          organizationId: orgContext.organizationId,
          stage: 'CLOSED_WON',
          createdAt: MoreThan(startDate),
        }
      }),
    ]);

    const leadToQualifiedRate = newLeads > 0 ? (qualifiedLeads / newLeads) * 100 : 0;
    const qualifiedToConvertedRate = qualifiedLeads > 0 ? (convertedLeads / qualifiedLeads) * 100 : 0;
    const dealConversionRate = newDeals > 0 ? (wonDeals / newDeals) * 100 : 0;

    return {
      period,
      startDate,
      endDate: now,
      newLeads,
      qualifiedLeads,
      convertedLeads,
      newDeals,
      wonDeals,
      leadToQualifiedRate: Math.round(leadToQualifiedRate * 100) / 100,
      qualifiedToConvertedRate: Math.round(qualifiedToConvertedRate * 100) / 100,
      dealConversionRate: Math.round(dealConversionRate * 100) / 100,
    };
  }

  async getRevenueAnalytics(orgContext: OrgContext, period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter': {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      }
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const revenueData = await this.dealRepo
      .createQueryBuilder('deal')
      .select('DATE_TRUNC(\'month\', deal.closedAt)', 'month')
      .addSelect('SUM(deal.value)', 'total')
      .addSelect('COUNT(deal.id)', 'count')
      .where('deal.organizationId = :orgId', { orgId: orgContext.organizationId })
      .andWhere('deal.stage = :stage', { stage: 'CLOSED_WON' })
      .andWhere('deal.closedAt >= :startDate', { startDate })
      .groupBy('DATE_TRUNC(\'month\', deal.closedAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const totalRevenue = revenueData.reduce((sum, row) => sum + parseFloat(row.total), 0);
    const totalDeals = revenueData.reduce((sum, row) => sum + parseInt(row.count), 0);
    const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    const monthlyData = revenueData.map(row => ({
      month: row.month,
      revenue: parseFloat(row.total),
      deals: parseInt(row.count),
    }));

    return {
      period,
      startDate,
      endDate: now,
      totalRevenue,
      totalDeals,
      avgDealSize: Math.round(avgDealSize * 100) / 100,
      monthlyData,
    };
  }

  async getTeamPerformance(orgContext: OrgContext) {
    const orgMembers = await this.orgMemberRepo.find({
      where: { organizationId: orgContext.organizationId },
    });

    const userIds = orgMembers.map(m => m.userId);
    const users = await this.userRepo.findByIds(userIds);
    const userMap = new Map(users.map(u => [u.id, u]));

    const performance = await Promise.all(orgMembers.map(async (member) => {
      const user = userMap.get(member.userId);
      if (!user) return null;

      const [leadsAssigned, dealsWon, dealsValue, tasksCompleted, activitiesCount] = await Promise.all([
        this.leadRepo.count({ where: { organizationId: orgContext.organizationId, ownerId: user.id } }),
        this.dealRepo.count({ where: { organizationId: orgContext.organizationId, ownerId: user.id, stage: 'CLOSED_WON' } }),
        this.dealRepo
          .createQueryBuilder('deal')
          .select('SUM(deal.value)', 'total')
          .where('deal.organizationId = :orgId AND deal.ownerId = :ownerId AND deal.stage = :stage', { 
            orgId: orgContext.organizationId, 
            ownerId: user.id, 
            stage: 'CLOSED_WON' 
          })
          .getRawOne(),
        this.taskRepo.count({ where: { organizationId: orgContext.organizationId, ownerId: user.id, completed: true } }),
        this.activityRepo.count({ where: { organizationId: orgContext.organizationId, userId: user.id } }),
      ]);

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: member.role,
        leadsAssigned,
        dealsWon,
        dealsValue: parseFloat(dealsValue?.total ?? '0'),
        tasksCompleted,
        activitiesCount,
      };
    }));

    return performance.filter(p => p !== null).sort((a, b) => b!.dealsValue - a!.dealsValue);
  }
}