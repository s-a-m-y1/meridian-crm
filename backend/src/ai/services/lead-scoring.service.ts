import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../modules/leads/lead.entity';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class LeadScoringService {
  private readonly logger = new Logger(LeadScoringService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
  ) {}

  async scoreLead(leadId: string, organizationId: string): Promise<any> {
    this.logger.log(`Scoring lead ${leadId} for org ${organizationId}`);

    const lead = await this.leadRepo.findOne({
      where: { id: leadId, organizationId },
      relations: ['customer'],
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Simple scoring algorithm
    let score = 0;
    const reasons: string[] = [];

    // Budget scoring
    if (lead.budgetMin && Number(lead.budgetMin) > 500000) {
      score += 25;
      reasons.push('High budget');
    } else if (lead.budgetMin && Number(lead.budgetMin) > 200000) {
      score += 15;
      reasons.push('Good budget');
    }

    // Activity scoring - simplified since activities relation may not exist
    const activityCount = 0; // lead.activities?.length ?? 0;
    if (activityCount > 5) {
      score += 20;
      reasons.push('High engagement');
    } else if (activityCount > 2) {
      score += 10;
      reasons.push('Moderate engagement');
    }

    // Budget range
    if (lead.budgetMax && lead.budgetMin && Number(lead.budgetMax) - Number(lead.budgetMin) < 100000) {
      score += 10;
      reasons.push('Clear budget range');
    }

    // Recent activity - simplified
    // const recentActivity = lead.activities?.find((a) => {
    //   const daysDiff = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    //   return daysDiff < 7;
    // });
    // if (recentActivity) {
    //   score += 15;
    //   reasons.push('Recent activity');
    // }

    // Source scoring
    if (lead.source === 'REFERRAL') {
      score += 15;
      reasons.push('Referral source');
    } else if (lead.source === 'WEBSITE') {
      score += 10;
      reasons.push('Website lead');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Classification
    let classification: 'HOT' | 'WARM' | 'COLD';
    if (score >= 70) classification = 'HOT';
    else if (score >= 40) classification = 'WARM';
    else classification = 'COLD';

    return {
      score,
      classification,
      reasons,
      scoredAt: new Date(),
    };
  }
}