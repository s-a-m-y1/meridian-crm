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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { PaginatedTasksDto } from './dto/paginated-tasks.dto';
import { Task } from './task.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create a new task' })
  async create(
    @Body() dto: CreateTaskDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Task> {
    return this.service.create(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List tasks with pagination, filtering, sorting' })
  async findAll(
    @Query() query: TaskQueryDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<PaginatedTasksDto> {
    return this.service.findAll(query, orgContext);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get a task by ID' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Task> {
    return this.service.findById(id, orgContext);
  }

  @Patch(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Update a task' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Task> {
    return this.service.update(id, dto, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.service.delete(id, orgContext);
  }
}