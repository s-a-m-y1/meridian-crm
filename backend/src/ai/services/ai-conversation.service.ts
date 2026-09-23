import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: any[];
  createdAt: Date;
}

export interface AIConversation {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}

@Entity('ai_conversations')
export class AIConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'jsonb', default: '[]' })
  messages: any[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('ai_messages')
export class AIMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conversation_id', type: 'uuid' })
  conversationId: string;

  @Column({ length: 20 })
  role: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'tool_calls', type: 'jsonb', nullable: true })
  toolCalls: any[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}

@Injectable()
export class AIConversationService {
  private readonly logger = new Logger(AIConversationService.name);

  constructor(
    @InjectRepository(AIConversationEntity)
    private readonly conversationRepo: Repository<any>,
    @InjectRepository(AIMessageEntity)
    private readonly messageRepo: Repository<any>,
  ) {}

  async createConversation(organizationId: string, userId: string, title?: string): Promise<any> {
    const conversation = this.conversationRepo.create({
      organizationId,
      userId,
      title: title || 'New Conversation',
      messages: [],
    });
    return this.conversationRepo.save(conversation);
  }

  async getConversation(conversationId: string, organizationId: string): Promise<any> {
    const conversation = await this.findOne(conversationId, organizationId);
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async getConversations(organizationId: string, userId?: string, limit = 20): Promise<any[]> {
    const qb = this.conversationRepo.createQueryBuilder('conv')
      .where('conv.organizationId = :orgId', { orgId: organizationId })
      .orderBy('conv.updatedAt', 'DESC')
      .take(limit);

    if (userId) {
      qb.andWhere('conv.userId = :userId', { userId });
    }

    return qb.getMany();
  }

  async addMessage(conversationId: string, role: 'user' | 'assistant' | 'system' | 'tool', content: string, toolCalls?: any[]): Promise<any> {
    const message = this.messageRepo.create({
      conversationId,
      role,
      content,
      toolCalls: toolCalls ?? [],
    });
    await this.messageRepo.save(message);

    await this.conversationRepo.update({ id: conversationId }, { updatedAt: new Date() });
    
    return { role, content, toolCalls };
  }

  async getMessages(conversationId: string, organizationId: string): Promise<any[]> {
    const conversation = await this.findOne(conversationId, organizationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  private async findOne(id: string, organizationId: string): Promise<any> {
    return this.conversationRepo.findOne({
      where: { id, organizationId },
      relations: ['messages'],
    });
  }

  async deleteConversation(conversationId: string, organizationId: string): Promise<void> {
    const conversation = await this.findOne(conversationId, organizationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    await this.messageRepo.delete({ conversationId });
    await this.conversationRepo.remove(conversation);
  }
}