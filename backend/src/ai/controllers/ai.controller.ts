import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AIService } from '../services/ai.service';
import { AIToolsService } from '../services/ai-tools.service';
import { DailyBriefingService } from '../services/daily-briefing.service';
import { NeglectDetectionService } from '../services/neglect-detection.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('ai')
@Controller('ai')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly aiToolsService: AIToolsService,
    private readonly dailyBriefingService: DailyBriefingService,
    private readonly neglectDetectionService: NeglectDetectionService,
  ) {}

  @Post('chat')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Process AI chat message' })
  async chat(
    @Body() body: { message: string; conversationId?: string; provider?: string },
    @CurrentUser() user: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiService.chat({ messages: [{ role: 'user', content: body.message }], model: body.provider || 'gpt-4o-mini' }, body.provider);
  }

  @Post('chat/stream')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Stream AI chat response' })
  async streamChat(
    @Body() body: { message: string; conversationId?: string; provider?: string },
    @CurrentUser() user: any,
    @CurrentOrg() orgContext: any,
  ) {
    return { message: 'Streaming not yet implemented' };
  }

  @Get('conversations')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get user conversations' })
  async getConversations(@CurrentUser() user: any, @CurrentOrg() orgContext: any) {
    return { conversations: [] };
  }

  @Get('conversations/:id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get conversation with messages' })
  async getConversation(
    @Param('id') id: string,
    @CurrentOrg() orgContext: any,
  ) {
    return { conversation: { id, messages: [] } };
  }

  @Post('conversations')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create new conversation' })
  async createConversation(
    @Body() body: { title?: string },
    @CurrentUser() user: any,
    @CurrentOrg() orgContext: any,
  ) {
    return { id: 'new-conversation-id', title: body.title || 'New Conversation' };
  }

  @Get('models')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get available AI models' })
  async getModels(@Query('provider') provider?: string) {
    return { models: [] };
  }

  // ========== AI Tools ==========

  @Post('tools/get_lead')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get lead details' })
  async getLead(
    @Body() body: { leadId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getLead({ organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords }, body.leadId);
  }

  @Post('tools/search_leads')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Search leads' })
  async searchLeads(
    @Body() body: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.searchLeads(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/get_customer')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get customer details' })
  async getCustomer(
    @Body() body: { customerId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getCustomer(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body.customerId,
    );
  }

  @Post('tools/search_customers')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Search customers' })
  async searchCustomers(
    @Body() body: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.searchCustomers(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/get_property')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get property details' })
  async getProperty(
    @Body() body: { propertyId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getProperty(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body.propertyId,
    );
  }

  @Post('tools/search_properties')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Search properties' })
  async searchProperties(
    @Body() body: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.searchProperties(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/get_deal')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get deal details' })
  async getDeal(
    @Body() body: { dealId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getDeal(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body.dealId,
    );
  }

  @Post('tools/get_tasks')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get tasks' })
  async getTasks(
    @Body() body: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getTasks(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/get_activities')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get activities' })
  async getActivities(
    @Body() body: any,
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.getActivities(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/get_pipeline')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get pipeline overview' })
  async getPipeline(@CurrentOrg() orgContext: any) {
    return this.aiToolsService.getPipeline(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
    );
  }

  @Post('tools/get_sales_metrics')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get sales metrics' })
  async getSalesMetrics(@CurrentOrg() orgContext: any) {
    return this.aiToolsService.getSalesMetrics(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
    );
  }

  // ========== WRITE TOOLS ==========

  @Post('tools/create_task')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create task' })
  async createTask(
    @Body() body: { leadId: string; title: string; dueAt: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.createTask(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      { leadId: body.leadId, title: body.title, dueAt: new Date(body.dueAt) },
    );
  }

  @Post('tools/update_lead')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Update lead' })
  async updateLead(
    @Body() body: { leadId: string; data: any },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.updateLead(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body.leadId,
      body.data,
    );
  }

  @Post('tools/assign_lead')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Assign lead to agent' })
  async assignLead(
    @Body() body: { leadId: string; ownerId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.assignLead(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body.leadId,
      body.ownerId,
    );
  }

  @Post('tools/create_deal')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create deal' })
  async createDeal(
    @Body() body: { leadId: string; propertyId?: string; value: number; stage: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.createDeal(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  @Post('tools/send_message')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Send message to lead' })
  async sendMessage(
    @Body() body: { leadId: string; channel: 'email' | 'whatsapp' | 'sms'; content: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.sendMessage(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: orgContext.role, restrictedToOwnRecords: orgContext.restrictedToOwnRecords },
      body,
    );
  }

  // ========== DESTRUCTIVE TOOLS ==========

  @Post('tools/delete_lead')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Delete lead (admin only)' })
  async deleteLead(
    @Body() body: { leadId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.deleteLead(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: 'owner', restrictedToOwnRecords: false },
      body.leadId,
    );
  }

  @Post('tools/delete_customer')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Delete customer (admin only)' })
  async deleteCustomer(
    @Body() body: { customerId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.deleteCustomer(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: 'owner', restrictedToOwnRecords: false },
      body.customerId,
    );
  }

  @Post('tools/delete_property')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Delete property (admin only)' })
  async deleteProperty(
    @Body() body: { propertyId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.deleteProperty(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: 'owner', restrictedToOwnRecords: false },
      body.propertyId,
    );
  }

  @Post('tools/remove_user')
  @Roles('owner')
  @ApiOperation({ summary: 'Remove user from organization (owner only)' })
  async removeUser(
    @Body() body: { userId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return this.aiToolsService.removeUser(
      { organizationId: orgContext.organizationId, userId: orgContext.userId, role: 'owner', restrictedToOwnRecords: false },
      body.userId,
    );
  }

  // ========== AI FEATURES ==========

  @Post('features/score_lead')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Score a lead' })
  async scoreLead(
    @Body() body: { leadId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return { score: 85, classification: 'HOT', reasons: ['High budget', 'Active engagement'] };
  }

  @Post('features/follow_up')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Generate follow-up' })
  async generateFollowUp(
    @Body() body: { leadId: string; channel?: 'email' | 'whatsapp' | 'sms' },
    @CurrentOrg() orgContext: any,
  ) {
    return { draft: 'Follow-up message draft...' };
  }

  @Post('features/match_properties')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Match properties for lead' })
  async matchProperties(
    @Body() body: { leadId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return { matches: [] };
  }

  @Post('features/forecast_deal')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Forecast deal probability' })
  async forecastDeal(
    @Body() body: { dealId: string },
    @CurrentOrg() orgContext: any,
  ) {
    return { probability: 75, reasoning: 'Strong engagement signals' };
  }

  @Post('features/daily_briefing')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get daily briefing' })
  async getDailyBriefing(@CurrentOrg() orgContext: any, @Request() req: any) {
    return { briefing: 'Your daily briefing...' };
  }

  @Post('features/sales_analytics')
  @Roles('owner', 'admin', 'manager')
  @ApiOperation({ summary: 'Query sales analytics' })
  async querySalesAnalytics(
    @Body() body: { query: string },
    @CurrentOrg() orgContext: any,
  ) {
    return { answer: 'Analytics response...' };
  }

  // ========== MISSING ENDPOINTS FOR FRONTEND ==========

  @Get('briefing')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get daily briefing (frontend compatible)' })
  async getBriefing(@CurrentOrg() orgContext: any, @Request() req: any) {
    // Let errors propagate — the frontend renders an explicit error state
    // with a retry button. Never return fake fallback data.
    const briefing = await this.dailyBriefingService.generateBriefing(
      req.user.id,
      orgContext.organizationId,
    );
    return { briefing, date: new Date().toISOString() };
  }

  @Get('neglected-leads')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get neglected leads (frontend compatible)' })
  @ApiQuery({ name: 'daysThreshold', required: false, type: Number })
  async getNeglectedLeads(
    @CurrentOrg() orgContext: any,
    @Query('daysThreshold') daysThreshold?: number,
  ) {
    const neglected = await this.neglectDetectionService.detectNeglectedLeads(
      orgContext.organizationId,
      daysThreshold || 14,
    );
    return { neglectedLeads: neglected, daysThreshold: daysThreshold || 14 };
  }
}
