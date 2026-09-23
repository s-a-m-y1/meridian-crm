import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan, Between } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { Deal } from '../../modules/deals/deal.entity';
import { Task } from '../../modules/tasks/task.entity';
import { Activity } from '../../modules/activities/activity.entity';
import { Customer } from '../../modules/customers/customer.entity';
import { NeglectDetectionService } from './neglect-detection.service';

const ACTIVE_STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION'];

@Injectable()
export class DailyBriefingService {
  private readonly logger = new Logger(DailyBriefingService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    private readonly neglectDetectionService: NeglectDetectionService,
  ) {}

  async generateBriefing(userId: string, organizationId: string): Promise<any> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Summary counts — real data, same filters as DashboardService.getStats
    const [newLeads, activeDeals, tasksDue, overdueTasks, meetingsToday, wonDeals, lostDeals] =
      await Promise.all([
        this.leadRepo.count({ where: { organizationId, createdAt: MoreThan(yesterday) } }),
        this.dealRepo.count({ where: { organizationId, stage: In(ACTIVE_STAGES) } }),
        this.taskRepo.count({ where: { organizationId, completed: false } }),
        this.taskRepo.count({
          where: { organizationId, completed: false, dueAt: LessThan(now) },
        }),
        this.activityRepo.count({
          where: {
            organizationId,
            type: In(['VIEWING', 'MEETING']),
            createdAt: Between(startOfToday, endOfToday),
          },
        }),
        this.dealRepo.count({ where: { organizationId, stage: 'CLOSED_WON' } }),
        this.dealRepo.count({ where: { organizationId, stage: 'CLOSED_LOST' } }),
      ]);

    // Priorities — overdue tasks (URGENT) and today's meetings/viewings (HIGH)
    const [overdueTaskList, todaysMeetings] = await Promise.all([
      this.taskRepo.find({
        where: { organizationId, completed: false, dueAt: LessThan(now) },
        order: { dueAt: 'ASC' },
        take: 3,
      }),
      this.activityRepo.find({
        where: {
          organizationId,
          type: In(['VIEWING', 'MEETING']),
          createdAt: Between(startOfToday, endOfToday),
        },
        order: { createdAt: 'ASC' },
        take: 3,
      }),
    ]);

    const priorities = [
      ...overdueTaskList.map((task) => ({
        type: 'URGENT' as const,
        title: `Overdue: ${task.title}`,
        reason: `Due ${task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'earlier'}`,
        action: 'Complete or reschedule this task today',
      })),
      ...todaysMeetings.map((activity) => ({
        type: 'HIGH' as const,
        title: activity.content?.slice(0, 80) || `${activity.type} scheduled`,
        time: new Date(activity.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        preparation: activity.type === 'VIEWING' ? 'Prepare property details and brochure' : undefined,
      })),
    ];

    // Opportunities — top active deals by value
    const topDeals = await this.dealRepo
      .createQueryBuilder('deal')
      .leftJoin(Lead, 'lead', 'lead.id = deal.leadId')
      .leftJoin(Customer, 'customer', 'customer.id = lead.customerId')
      .select('deal.id', 'dealId')
      .addSelect('deal.value', 'value')
      .addSelect('deal.ai_close_probability', 'aiCloseProbability')
      .addSelect('customer.name', 'leadName')
      .where('deal.organizationId = :orgId', { orgId: organizationId })
      .andWhere('deal.stage IN (:...stages)', { stages: ACTIVE_STAGES })
      .orderBy('deal.value', 'DESC')
      .take(3)
      .getRawMany();

    const opportunities = topDeals.map((d) => ({
      lead: d.leadName || 'Unnamed lead',
      action: 'Follow up and move to the next stage',
      probability: d.aiCloseProbability ? Math.round(Number(d.aiCloseProbability)) : 50,
    }));

    // Risks — real neglected leads detection
    const neglected = await this.neglectDetectionService.detectNeglectedLeads(organizationId, 14);
    const risks = neglected
      .filter((n) => n.riskLevel === 'HIGH' || n.riskLevel === 'MEDIUM')
      .slice(0, 3)
      .map((n) => ({
        lead: n.leadName,
        risk: `No activity for ${n.daysSinceActivity} days`,
        mitigation: n.recommendedAction,
      }));

    // Metrics
    const pipelineValue = await this.dealRepo
      .createQueryBuilder('deal')
      .select('COALESCE(SUM(deal.value), 0)', 'total')
      .where('deal.organizationId = :orgId', { orgId: organizationId })
      .andWhere('deal.stage IN (:...stages)', { stages: ACTIVE_STAGES })
      .getRawOne();

    const closedTotal = wonDeals + lostDeals;
    const conversionRate =
      closedTotal > 0 ? Math.round((wonDeals / closedTotal) * 1000) / 10 : 0;

    return {
      userId,
      organizationId,
      date: now.toISOString().split('T')[0],
      summary: { newLeads, activeDeals, tasksDue, overdueTasks, meetingsToday },
      priorities,
      opportunities,
      risks,
      metrics: {
        activeDeals,
        totalPipelineValue: parseFloat(pipelineValue?.total ?? '0'),
        conversionRate,
        avgResponseTime: '—',
      },
      generatedAt: now.toISOString(),
    };
  }
}
