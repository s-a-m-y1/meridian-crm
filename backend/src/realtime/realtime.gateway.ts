import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>
  private socketOrgs: Map<string, string> = new Map(); // socketId -> organizationId

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      // Extract token from query or auth
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret') || 'dev-secret',
      });

      const userId = payload.sub;
      const orgId = payload.orgId || payload.organizationId;

      if (!userId || !orgId) {
        this.logger.warn(`Client ${client.id} token missing userId or orgId`);
        client.disconnect();
        return;
      }

      // Join organization room
      client.join(`org:${orgId}`);
      // Join user-specific room
      client.join(`user:${userId}`);

      // Track mappings
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      this.socketOrgs.set(client.id, orgId);

      this.logger.log(`Client ${client.id} connected: user=${userId}, org=${orgId}`);

      // Send connection confirmation
      client.emit('connected', { userId, orgId, socketId: client.id });

    } catch (error) {
      this.logger.warn(`Client ${client.id} authentication failed: ${((error as Error).message)}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const orgId = this.socketOrgs.get(client.id);
    
    // Find and remove from user sockets
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }

    this.socketOrgs.delete(client.id);

    if (orgId) {
      this.logger.log(`Client ${client.id} disconnected from org:${orgId}`);
    }
  }

  @SubscribeMessage('join:resource')
  handleJoinResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceType: string; resourceId: string },
  ): void {
    const orgId = this.socketOrgs.get(client.id);
    if (!orgId) return;

    const room = `resource:${data.resourceType}:${data.resourceId}`;
    client.join(room);
    client.emit('joined:resource', { resourceType: data.resourceType, resourceId: data.resourceId });
  }

  @SubscribeMessage('leave:resource')
  handleLeaveResource(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { resourceType: string; resourceId: string },
  ): void {
    const room = `resource:${data.resourceType}:${data.resourceId}`;
    client.leave(room);
  }

  // Public methods for services to emit events

  emitToOrganization(orgId: string, event: string, data: any): void {
    this.server.to(`org:${orgId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToResource(orgId: string, resourceType: string, resourceId: string, event: string, data: any): void {
    this.server.to(`resource:${resourceType}:${resourceId}`).emit(event, { ...data, resourceType, resourceId });
  }

  // Convenience methods for common events
  emitLeadCreated(orgId: string, lead: any): void {
    this.emitToOrganization(orgId, 'lead:created', lead);
  }

  emitLeadUpdated(orgId: string, lead: any): void {
    this.emitToOrganization(orgId, 'lead:updated', lead);
  }

  emitLeadAssigned(orgId: string, lead: any): void {
    this.emitToOrganization(orgId, 'lead:assigned', lead);
    // Also notify the assigned user
    if (lead.ownerId) {
      this.emitToUser(lead.ownerId, 'lead:assigned', lead);
    }
  }

  emitDealStageChanged(orgId: string, deal: any): void {
    this.emitToOrganization(orgId, 'deal:stage-changed', deal);
    this.emitToResource(orgId, 'deal', deal.id, 'deal:stage-changed', deal);
  }

  emitTaskAssigned(orgId: string, task: any): void {
    this.emitToOrganization(orgId, 'task:assigned', task);
    if (task.ownerId) {
      this.emitToUser(task.ownerId, 'task:assigned', task);
    }
  }

  emitTaskDueSoon(orgId: string, task: any): void {
    if (task.ownerId) {
      this.emitToUser(task.ownerId, 'task:due-soon', task);
    }
  }

  emitAIAlert(orgId: string, alert: any): void {
    this.emitToOrganization(orgId, 'ai:alert', alert);
  }

  emitNotification(orgId: string, notification: any): void {
    this.emitToOrganization(orgId, 'notification:new', notification);
  }

  getConnectedUsers(orgId: string): number {
    // This would need a more sophisticated implementation
    // For now, return the number of sockets in the org room
    const room = this.server.sockets.adapter.rooms.get(`org:${orgId}`);
    return room ? room.size : 0;
  }
}
