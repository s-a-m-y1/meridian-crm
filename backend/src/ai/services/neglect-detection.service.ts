import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { Activity } from '../../modules/activities/activity.entity';
import { Customer } from '../../modules/customers/customer.entity';

@Injectable()
export class NeglectDetectionService {
  private readonly logger = new Logger(NeglectDetectionService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
  ) {}

  /**
   * Detect leads with no activity for >= daysThreshold days.
   * "Last activity" falls back to the lead's createdAt date when a lead
   * has never been touched.
   */
  async detectNeglectedLeads(organizationId: string, daysThreshold = 14): Promise<any[]> {
    const rows = await this.leadRepo
      .createQueryBuilder('lead')
      .select('lead.id', 'leadId')
      .addSelect('customer.name', 'leadName')
      .addSelect('MAX(activity.createdAt)', 'lastActivityDate')
      .addSelect('MAX(lead.createdAt)', 'leadCreatedAt')
      .leftJoin(Activity, 'activity', 'activity.leadId = lead.id')
      .leftJoin(Customer, 'customer', 'customer.id = lead.customerId')
      .where('lead.organizationId = :orgId', { orgId: organizationId })
      .andWhere('lead.status NOT IN (:...closedStatuses)', {
        closedStatuses: ['CONVERTED', 'UNQUALIFIED'],
      })
      .groupBy('lead.id')
      .addGroupBy('customer.name')
      .getRawMany();

    return rows
      .map((row) => {
        const lastActivity = row.lastActivityDate
          ? new Date(row.lastActivityDate)
          : new Date(row.leadCreatedAt);
        const daysSinceActivity = Math.floor(
          (Date.now() - lastActivity.getTime()) / (24 * 60 * 60 * 1000),
        );
        const riskLevel =
          daysSinceActivity >= daysThreshold * 2
            ? 'HIGH'
            : daysSinceActivity >= daysThreshold
              ? 'MEDIUM'
              : 'LOW';
        return {
          leadId: row.leadId,
          leadName: row.leadName || 'Unknown lead',
          lastActivity: lastActivity.toISOString(),
          daysSinceActivity,
          riskLevel,
          recommendedAction:
            riskLevel === 'HIGH'
              ? 'Urgent follow-up call today'
              : 'Send a follow-up email or WhatsApp message',
        };
      })
      .filter((lead) => lead.daysSinceActivity >= daysThreshold)
      .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);
  }

  async getNeglectRisk(leadId: string, _organizationId: string): Promise<any> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) {
      return { leadId, riskLevel: 'LOW', daysSinceActivity: 0, lastActivity: null };
    }

    const lastActivity = await this.leadRepo
      .createQueryBuilder('lead')
      .leftJoin(Activity, 'activity', 'activity.leadId = lead.id')
      .select('MAX(activity.createdAt)', 'last')
      .where('lead.id = :leadId', { leadId })
      .getRawOne();

    const last = lastActivity?.last ? new Date(lastActivity.last) : new Date(lead.createdAt);
    const daysSinceActivity = Math.floor(
      (Date.now() - last.getTime()) / (24 * 60 * 60 * 1000),
    );

    return {
      leadId,
      riskLevel: daysSinceActivity >= 28 ? 'HIGH' : daysSinceActivity >= 14 ? 'MEDIUM' : 'LOW',
      daysSinceActivity,
      lastActivity: last.toISOString(),
    };
  }
}
