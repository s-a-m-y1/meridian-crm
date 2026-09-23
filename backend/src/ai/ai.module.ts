import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenAIProvider } from './services/openai.provider';
import { AnthropicProvider } from './services/anthropic.provider';
import { AIService } from './services/ai.service';
import { AIToolsService } from './services/ai-tools.service';
import { AIPermissionsService } from './services/ai-permissions.service';
import { AIContextService } from './services/ai-context.service';
// import { AIConversationService } from './services/ai-conversation.service'; // requires AIConversationEntity
import { LeadScoringService } from './services/lead-scoring.service';
import { FollowUpGenerationService } from './services/follow-up-generation.service';
import { PropertyMatchingService } from './services/property-matching.service';
import { DealForecastingService } from './services/deal-forecasting.service';
import { SalesAnalyticsService } from './services/sales-analytics.service';
import { NeglectDetectionService } from './services/neglect-detection.service';
import { DailyBriefingService } from './services/daily-briefing.service';
import { AiProviderService } from './services/ai-provider.service';
import { AIController } from './controllers/ai.controller';
import { Lead } from '../modules/leads/lead.entity';
import { Customer } from '../modules/customers/customer.entity';
import { Property } from '../modules/properties/property.entity';
import { Deal } from '../modules/deals/deal.entity';
import { Task } from '../modules/tasks/task.entity';
import { Activity } from '../modules/activities/activity.entity';
import { User } from '../modules/users/user.entity';
import { Organization } from '../modules/organizations/entities/organization.entity';
import { OrganizationsModule } from '../modules/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule,
    OrganizationsModule,
    TypeOrmModule.forFeature([Lead, Customer, Property, Deal, Task, Activity, User, Organization]),
  ],
  controllers: [AIController],
  providers: [
    OpenAIProvider,
    AnthropicProvider,
    AiProviderService,
    AIService,
    AIToolsService,
    AIPermissionsService,
    AIContextService,
    // AIConversationService, // requires AIConversationEntity
    LeadScoringService,
    FollowUpGenerationService,
    PropertyMatchingService,
    DealForecastingService,
    SalesAnalyticsService,
    NeglectDetectionService,
    DailyBriefingService,
    {
      provide: 'AI_PROVIDER_FACTORY',
      useFactory: (configService: ConfigService, openai: OpenAIProvider, anthropic: AnthropicProvider) => {
        const providers: Record<string, any> = {};
        
        // Register OpenAI provider if configured and client is initialized
        if (openai && (openai as any).client) {
          providers.openai = openai;
        }
        
        // Register Anthropic provider if configured and client is initialized
        if (anthropic && (anthropic as any).client) {
          providers.anthropic = anthropic;
        }
        
        // If no providers configured, add a mock provider for development
        if (Object.keys(providers).length === 0) {
          providers.mock = {
            name: 'mock',
            async chat(request: any) {
              return {
                id: 'mock-response',
                model: 'mock',
                choices: [{
                  index: 0,
                  message: { role: 'assistant', content: 'This is a mock AI response. Configure OPENAI_API_KEY or ANTHROPIC_API_KEY for real responses.' },
                  finishReason: 'stop'
                }],
                usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                created: Date.now()
              };
            },
            async streamChat(request: any) {
              return (async function* () {
                yield { id: 'mock-stream', model: 'mock', choices: [{ index: 0, delta: { content: 'Mock response. ' }, finishReason: null }] };
                yield { id: 'mock-stream', model: 'mock', choices: [{ index: 0, delta: { content: 'Configure API keys for real AI.' }, finishReason: 'stop' }] };
              })();
            },
            async getModels() { return []; },
            async validateConfig() { return true; }
          };
        }
        
        return providers;
      },
      inject: [ConfigService, OpenAIProvider, AnthropicProvider],
    },
  ],
  exports: [
    AiProviderService,
    AIService,
    AIToolsService,
    AIPermissionsService,
    AIContextService,
    // AIConversationService,
    LeadScoringService,
    FollowUpGenerationService,
    PropertyMatchingService,
    DealForecastingService,
    SalesAnalyticsService,
    NeglectDetectionService,
    DailyBriefingService,
  ],
})
export class AIModule {}
