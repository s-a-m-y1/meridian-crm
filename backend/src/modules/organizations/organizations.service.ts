import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember, MemberRole } from './entities/organization-member.entity';
import { OrganizationSettings } from './entities/organization-settings.entity';

export interface MembershipView {
  organizationId: string;
  role: MemberRole;
  restrictedToOwnRecords: boolean;
}

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
    @InjectRepository(OrganizationSettings)
    private readonly settingsRepo: Repository<OrganizationSettings>,
  ) {}

  async createWithOwner(
    name: string,
    userId: string,
  ): Promise<{ organization: Organization; member: OrganizationMember }> {
    return this.orgRepo.manager.transaction(async (em) => {
      const org = em.create(Organization, { name });
      await em.save(org);

      const member = em.create(OrganizationMember, {
        organizationId: org.id,
        userId,
        role: 'owner',
        restrictedToOwnRecords: false,
      });
      await em.save(member);

      const settings = em.create(OrganizationSettings, {
        organizationId: org.id,
        settings: {},
      });
      await em.save(settings);

      return { organization: org, member };
    });
  }

  async getMembership(userId: string, organizationId: string): Promise<MembershipView | null> {
    const member = await this.memberRepo.findOne({
      where: { userId, organizationId },
      select: ['organizationId', 'role', 'restrictedToOwnRecords'],
    });
    return member as MembershipView | null;
  }

  async getFirstMembership(userId: string): Promise<MembershipView | null> {
    const member = await this.memberRepo.findOne({
      where: { userId },
      order: { createdAt: 'ASC' },
      select: ['organizationId', 'role', 'restrictedToOwnRecords'],
    });
    return member as MembershipView | null;
  }

  async getOrganizationsForUser(userId: string): Promise<Organization[]> {
    const memberships = await this.memberRepo.find({
      where: { userId },
      relations: ['organization'],
      order: { createdAt: 'ASC' },
    });
    return memberships.map((m) => m.organization);
  }

  async findById(id: string): Promise<Organization | null> {
    return this.orgRepo.findOne({ where: { id } });
  }

  async updateName(id: string, name: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    org.name = name;
    return this.orgRepo.save(org);
  }

  async updateSettings(
    organizationId: string,
    settings: Record<string, unknown>,
  ): Promise<OrganizationSettings> {
    const existing = await this.settingsRepo.findOne({ where: { organizationId } });
    if (!existing) throw new NotFoundException('Organization not found');
    existing.settings = { ...existing.settings, ...settings };
    return this.settingsRepo.save(existing);
  }
}