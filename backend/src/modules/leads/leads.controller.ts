import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { PaginatedLeadsDto } from './dto/paginated-leads.dto';
import { Lead } from './lead.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('leads')
@Controller('leads')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create a new lead' })
  async create(
    @Body() dto: CreateLeadDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Lead> {
    return this.service.create(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List leads with pagination, filtering, sorting, search' })
  async findAll(
    @Query() query: LeadQueryDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<PaginatedLeadsDto> {
    return this.service.findAll(query, orgContext);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get a lead by ID' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Lead> {
    return this.service.findById(id, orgContext);
  }

  @Patch(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Update a lead' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Lead> {
    return this.service.update(id, dto, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lead' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.service.delete(id, orgContext);
  }
}