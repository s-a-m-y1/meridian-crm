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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { PaginatedCustomersDto } from './dto/paginated-customers.dto';
import { Customer } from './customer.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('customers')
@Controller('customers')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create a new customer' })
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Customer> {
    return this.service.create(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List customers with pagination, filtering, sorting' })
  async findAll(
    @Query() query: CustomerQueryDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<PaginatedCustomersDto> {
    return this.service.findAll(query, orgContext);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get a customer by ID' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Customer> {
    return this.service.findById(id, orgContext);
  }

  @Patch(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Update a customer' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Customer> {
    return this.service.update(id, dto, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.service.delete(id, orgContext);
  }
}