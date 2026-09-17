import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { PaginatedActivitiesDto } from './dto/paginated-activities.dto';
import { Activity } from './activity.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('activities')
@Controller('activities')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create a new activity (append-only log)' })
  async create(
    @Body() dto: CreateActivityDto,
    @CurrentOrg() orgContext: any,
  ): Promise<Activity> {
    return this.service.create(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List activities with pagination, filtering' })
  async findAll(
    @Query() query: ActivityQueryDto,
    @CurrentOrg() orgContext: any,
  ): Promise<PaginatedActivitiesDto> {
    return this.service.findAll(query, orgContext);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get an activity by ID' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: any,
  ): Promise<Activity> {
    return this.service.findById(id, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an activity (admin only)' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: any,
  ): Promise<void> {
    // Activities are append-only; only admins can delete
    return this.service.delete(id, orgContext);
  }
}