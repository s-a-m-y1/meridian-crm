import { Injectable, Logger, Optional, ForbiddenException } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIToolsService } from './ai-tools.service';
import { AIPermissionsService } from './ai-permissions.service';
import { AIContextService } from './ai-context.service';
import { AIConversationService } from './ai-conversation.service';
import { LeadScoringService } from './lead-scoring.service';
import { FollowUpGenerationService } from './follow-up-generation.service';
import { PropertyMatchingService } from './property-matching.service';
import { DealForecastingService } from './deal-forecasting.service';
import { SalesAnalyticsService } from './sales-analytics.service';
import { NeglectDetectionService } from './neglect-detection.service';
import { DailyBriefingService } from './daily-briefing.service';
import { AIChatRequest } from '../interfaces/ai-provider.interface';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class AIOrchestratorService {
  private readonly logger = new Logger(AIOrchestratorService.name);

  constructor(
    private readonly aiService: AIService,
    private readonly aiToolsService: AIToolsService,
    private readonly permissionsService: AIPermissionsService,
    private readonly contextService: AIContextService,
    @Optional() private readonly conversationService: AIConversationService,
    private readonly leadScoringService: LeadScoringService,
    private readonly followUpService: FollowUpGenerationService,
    private readonly propertyMatchingService: PropertyMatchingService,
    private readonly dealForecastingService: DealForecastingService,
    private readonly salesAnalyticsService: SalesAnalyticsService,
    private readonly neglectDetectionService: NeglectDetectionService,
    private readonly dailyBriefingService: DailyBriefingService,
  ) {}

  async processChat(
    userId: string,
    organizationId: string,
    message: string,
    conversationId?: string,
  ): Promise<{ response: string; conversationId: string }> {
    this.logger.log(`Processing chat for user ${userId} in org ${organizationId}`);

    // Check permissions
    const hasAccess = await this.permissionsService.checkPermission(userId, organizationId, 'chat');
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to use AI chat');
    }

    // Get context from CRM data
    const context = await this.contextService.buildContext(organizationId, userId);

    // Build system prompt with context
    const systemPrompt = this.buildSystemPrompt(context);

    // Create or get conversation
    let convId = conversationId;
    if (!convId && this.conversationService) {
      const conversation = await this.conversationService.createConversation(userId, organizationId);
      convId = conversation.id;
    } else if (!convId) {
      convId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Prepare messages for AI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: message },
    ];

    // Call AI service
    const aiResponse = await this.aiService.chat({
      messages,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Save conversation message if conversation service is available
    const responseContent = aiResponse.choices[0]?.message?.content ?? '';
    if (this.conversationService && convId) {
      await this.conversationService.addMessage(convId, 'user', message);
      await this.conversationService.addMessage(convId, 'assistant', responseContent);
    }

    return {
      response: responseContent,
      conversationId: convId ?? '',
    };
  }

  private buildSystemPrompt(context: any): string {
    return `You are an AI assistant for a Real Estate CRM. You have access to the following data:

Organization: ${context.organization?.name ?? 'Unknown'}
User: ${context.user?.name ?? 'Unknown'}

Recent Leads: ${JSON.stringify(context.leads?.slice(0, 5) ?? [])}
Recent Customers: ${JSON.stringify(context.customers?.slice(0, 5) ?? [])}
Recent Properties: ${JSON.stringify(context.properties?.slice(0, 5) ?? [])}
Recent Deals: ${JSON.stringify(context.deals?.slice(0, 5) ?? [])}
Recent Tasks: ${JSON.stringify(context.tasks?.slice(0, 5) ?? [])}

Use this data to provide helpful, accurate responses. Always reference specific data when possible.`;
  }
}
