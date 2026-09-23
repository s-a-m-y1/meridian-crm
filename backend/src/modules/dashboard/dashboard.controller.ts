import { Controller, Get, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getStats(@Request() req: any) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getStats(orgContext);
  }

  @Get('leads/recent')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get recent leads' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentLeads(@Request() req: any, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getRecentLeads(orgContext, limit ?? 10);
  }

  @Get('tasks/upcoming')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get upcoming tasks' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUpcomingTasks(@Request() req: any, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getUpcomingTasks(orgContext, limit ?? 10);
  }

  @Get('activities/recent')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentActivities(@Request() req: any, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getRecentActivities(orgContext, limit ?? 10);
  }

  @Get('pipeline')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get pipeline summary' })
  async getPipeline(@Request() req: any) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getPipeline(orgContext);
  }

  @Get('analytics/sales')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Get sales analytics' })
  async getSalesAnalytics(@Request() req: any) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getSalesAnalytics(orgContext);
  }

  @Get('analytics/conversion')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Get conversion metrics' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
  async getConversionMetrics(@Request() req: any, @Query('period') period?: string) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getConversionMetrics(orgContext, period ?? 'month');
  }

  @Get('analytics/revenue')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
  async getRevenueAnalytics(@Request() req: any, @Query('period') period?: string) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getRevenueAnalytics(orgContext, period ?? 'month');
  }

  @Get('analytics/team-performance')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Get team performance metrics' })
  async getTeamPerformance(@Request() req: any) {
    const orgContext: OrgContext = req.orgContext;
    return this.dashboardService.getTeamPerformance(orgContext);
  }
}
