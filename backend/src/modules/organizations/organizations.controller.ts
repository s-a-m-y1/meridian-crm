import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import type { OrgContext } from '../../common/decorators/org-context.interface';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(AuthGuard, OrganizationMemberGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly orgs: OrganizationsService) {}

  @Get('current')
  @ApiOperation({ summary: "Current user's current organization" })
  async current(@CurrentOrg() org: OrgContext) {
    const entity = await this.orgs.findById(org.organizationId);
    return entity
      ? { ...entity, role: org.role }
      : { id: org.organizationId, role: org.role };
  }

  @Patch('current')
  @ApiOperation({ summary: 'Rename current organization (owner/admin only implied by membership)' })
  async updateCurrent(
    @CurrentOrg() org: OrgContext,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.orgs.updateName(org.organizationId, dto.name);
  }
}
