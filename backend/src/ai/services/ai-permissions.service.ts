import { Injectable, ForbiddenException } from '@nestjs/common';

export interface AuthContext {
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'agent';
  restrictedToOwnRecords: boolean;
}

export interface ToolPermissions {
  read: string[];
  write: string[];
  destructive: string[];
}

@Injectable()
export class AIPermissionsService {
  private readonly rolePermissions: Record<string, ToolPermissions> = {
    owner: {
      read: ['*'],
      write: ['*'],
      destructive: ['*'],
    },
    admin: {
      read: ['*'],
      write: ['create_task', 'update_lead', 'assign_lead', 'create_deal', 'send_message'],
      destructive: ['delete_lead', 'delete_customer', 'delete_property', 'remove_user'],
    },
    manager: {
      read: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline', 'get_sales_metrics'],
      write: ['create_task', 'update_lead', 'assign_lead', 'create_deal', 'send_message'],
      destructive: [],
    },
    agent: {
      read: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline'],
      write: ['create_task', 'update_lead', 'create_deal', 'send_message'],
      destructive: [],
    },
  };

  private readonly toolCategories = {
    read: ['get_lead', 'search_leads', 'get_customer', 'search_customers', 'get_property', 'search_properties', 'get_deal', 'get_tasks', 'get_activities', 'get_pipeline', 'get_sales_metrics'],
    write: ['create_task', 'update_lead', 'assign_lead', 'create_deal', 'send_message'],
    destructive: ['delete_lead', 'delete_customer', 'delete_property', 'remove_user'],
  };

  canAccessTool(role: string, toolName: string): boolean {
    const permissions = this.rolePermissions[role];
    if (!permissions) return false;

    if (permissions.read.includes('*') || permissions.write.includes('*') || permissions.destructive.includes('*')) {
      return true;
    }

    for (const category of Object.keys(this.toolCategories)) {
      if ((this.toolCategories as Record<string, string[]>)[category].includes(toolName)) {
        return (permissions as unknown as Record<string, string[]>)[category as keyof ToolPermissions]?.includes(toolName) ?? false;
      }
    }
    return false;
  }

  checkPermission(userId: string, organizationId: string, action: string): Promise<boolean> {
    // For now, allow all actions - in a real implementation, check user's role and permissions
    return Promise.resolve(true);
  }

  validateToolAccess(context: { role: string }, toolName: string): void {
    if (!this.canAccessTool(context.role, toolName)) {
      throw new Error(`Role "${context.role}" does not have permission to use tool "${toolName}"`);
    }
  }

  validateWriteOperation(context: { role: string; restrictedToOwnRecords?: boolean }, toolName: string, userId: string, resourceOwnerId?: string): void {
    if (!this.canAccessTool(context.role, toolName)) {
      throw new Error(`Role "${context.role}" does not have permission for ${toolName}`);
    }

    if (this.isWriteTool(toolName) && context.restrictedToOwnRecords) {
      // In a real implementation, you'd check if the user owns the resource
      // For now, we trust the tool to validate ownership
    }
  }

  private isWriteTool(toolName: string): boolean {
    return this.toolCategories.write.includes(toolName) || this.toolCategories.destructive.includes(toolName);
  }

  getAllowedTools(role: string): string[] {
    const permissions = this.rolePermissions[role];
    if (!permissions) return [];

    const tools: string[] = [];
    if (permissions.read.includes('*')) tools.push(...this.toolCategories.read);
    else tools.push(...permissions.read);
    if (permissions.write.includes('*')) tools.push(...this.toolCategories.write);
    else tools.push(...permissions.write);
    if (permissions.destructive.includes('*')) tools.push(...this.toolCategories.destructive);
    else tools.push(...permissions.destructive);
    return tools;
  }

  getAllToolDefinitions(): { read: string[]; write: string[]; destructive: string[] } {
    return { ...this.toolCategories };
  }
}
