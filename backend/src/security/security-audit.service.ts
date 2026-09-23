import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { AuditService, AuditAction, AuditSeverity } from '../observability/audit.service';

export interface SecurityScanResult {
  passed: boolean;
  issues: SecurityIssue[];
  score: number; // 0-100
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  remediation: string;
  location?: string;
}

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async runFullScan(): Promise<SecurityScanResult> {
    const issues: SecurityIssue[] = [];

    // Run all security checks
    issues.push(...await this.checkPasswordPolicies());
    issues.push(...await this.checkAuthenticationSecurity());
    issues.push(...await this.checkAuthorizationSecurity());
    issues.push(...await this.checkDataProtection());
    issues.push(...await this.checkApiSecurity());
    issues.push(...await this.checkInfrastructureSecurity());
    issues.push(...await this.checkLoggingAndMonitoring());

    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    const lowIssues = issues.filter(i => i.severity === 'low').length;

    // Calculate score (100 - deductions)
    let score = 100;
    score -= criticalIssues * 20;
    score -= highIssues * 10;
    score -= mediumIssues * 5;
    score -= lowIssues * 2;
    score = Math.max(0, score);

    return {
      passed: criticalIssues === 0 && highIssues === 0,
      issues,
      score,
    };
  }

  private async checkPasswordPolicies(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check for users with weak passwords (would need password hashes)
    // This is a placeholder - in real implementation, you'd check password hashes
    
    // Check for default/admin passwords
    const adminUsers = await this.userRepo.find({
      where: { email: 'admin@localhost' },
    });

    if (adminUsers.length > 0) {
      issues.push({
        severity: 'critical',
        category: 'Authentication',
        title: 'Default admin account detected',
        description: 'Default admin account with predictable credentials exists',
        remediation: 'Change default admin credentials immediately or disable the account',
        location: 'User table',
      });
    }

    // Check for users without password (if applicable)
    const usersWithoutPassword = await this.userRepo
      .createQueryBuilder('user')
      .where('user.passwordHash IS NULL OR user.passwordHash = \'\'')
      .getCount();

    if (usersWithoutPassword > 0) {
      issues.push({
        severity: 'high',
        category: 'Authentication',
        title: 'Users without password hashes',
        description: `${usersWithoutPassword} user(s) have no password hash set`,
        remediation: 'Ensure all users have strong password hashes',
        location: 'User table',
      });
    }

    return issues;
  }

  private async checkAuthenticationSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check JWT secret strength
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (jwtSecret && jwtSecret.length < 32) {
      issues.push({
        severity: 'high',
        category: 'Authentication',
        title: 'JWT secret too short',
        description: 'JWT secret should be at least 32 characters for production',
        remediation: 'Generate a strong random secret of at least 32 characters',
        location: 'Environment configuration',
      });
    }

    // Check refresh token secret
    const refreshSecret = this.configService.get<string>('REFRESH_SECRET');
    if (refreshSecret && refreshSecret.length < 32) {
      issues.push({
        severity: 'high',
        category: 'Authentication',
        title: 'Refresh token secret too short',
        description: 'Refresh token secret should be at least 32 characters for production',
        remediation: 'Generate a strong random secret of at least 32 characters',
        location: 'Environment configuration',
      });
    }

    // Check for default secrets
    if (jwtSecret?.includes('change-me') || refreshSecret?.includes('change-me')) {
      issues.push({
        severity: 'critical',
        category: 'Authentication',
        title: 'Default secrets detected',
        description: 'JWT or refresh secrets contain default placeholder values',
        remediation: 'Replace all default secrets with strong random values',
        location: 'Environment configuration',
      });
    }

    return issues;
  }

  private async checkAuthorizationSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check for users with owner role (should be limited)
    const ownerCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('organization_members', 'om', 'om.userId = user.id')
      .where('om.role = :role', { role: 'owner' })
      .getCount();

    if (ownerCount > 10) {
      issues.push({
        severity: 'medium',
        category: 'Authorization',
        title: 'Many users with owner role',
        description: `${ownerCount} users have the owner role, which grants full access`,
        remediation: 'Review owner role assignments and limit to essential personnel',
        location: 'Organization members table',
      });
    }

    // Check for users with admin role
    const adminCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('organization_members', 'om', 'om.userId = user.id')
      .where('om.role = :role', { role: 'admin' })
      .getCount();

    if (adminCount > 50) {
      issues.push({
        severity: 'low',
        category: 'Authorization',
        title: 'Many users with admin role',
        description: `${adminCount} users have the admin role`,
        remediation: 'Review admin role assignments periodically',
        location: 'Organization members table',
      });
    }

    return issues;
  }

  private async checkDataProtection(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check for unencrypted sensitive data
    // This would require checking column encryption in database
    // Placeholder for actual implementation

    // Check for PII exposure in logs (checked via audit service)
    // Check for data retention policies

    return issues;
  }

  private async checkApiSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check rate limiting configuration
    const rateLimit = this.configService.get<number>('throttle.limit');
    if (rateLimit && rateLimit > 1000) {
      issues.push({
        severity: 'medium',
        category: 'API Security',
        title: 'Rate limit too high',
        description: `Global rate limit is set to ${rateLimit} requests per minute`,
        remediation: 'Lower rate limit to prevent abuse (recommended: 100-300)',
        location: 'Environment configuration',
      });
    }

    // Check CORS configuration
    const corsOrigin = this.configService.get<string>('CORS_ORIGIN');
    if (corsOrigin === '*' || corsOrigin === 'true') {
      issues.push({
        severity: 'high',
        category: 'API Security',
        title: 'Overly permissive CORS',
        description: 'CORS allows all origins, which can lead to CSRF and data theft',
        remediation: 'Restrict CORS to specific trusted domains',
        location: 'Environment configuration',
      });
    }

    return issues;
  }

  private async checkInfrastructureSecurity(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check database SSL
    const dbSsl = this.configService.get<string>('DB_SSL');
    if (!dbSsl || dbSsl === 'false') {
      issues.push({
        severity: 'high',
        category: 'Infrastructure',
        title: 'Database connection not encrypted',
        description: 'Database connections should use SSL/TLS in production',
        remediation: 'Enable SSL for database connections',
        location: 'Database configuration',
      });
    }

    // Check Redis password
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
    if (!redisPassword && this.configService.get<string>('NODE_ENV') === 'production') {
      issues.push({
        severity: 'medium',
        category: 'Infrastructure',
        title: 'Redis without password',
        description: 'Redis should have authentication enabled in production',
        remediation: 'Set a strong Redis password',
        location: 'Redis configuration',
      });
    }

    // Check for debug mode in production
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      const debugEnabled = this.configService.get<string>('DEBUG');
      if (debugEnabled) {
        issues.push({
          severity: 'low',
          category: 'Infrastructure',
          title: 'Debug mode enabled in production',
          description: 'Debug mode can expose sensitive information in error messages',
          remediation: 'Disable debug mode in production',
          location: 'Environment configuration',
        });
      }
    }

    return issues;
  }

  private async checkLoggingAndMonitoring(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check if audit logging is enabled
    // This would be verified by checking if audit service is working

    // Check if security events are logged
    // Check if alerts are configured for critical events

    return issues;
  }

  async generateReport(): Promise<string> {
    const scan = await this.runFullScan();
    
    let report = `# Security Audit Report\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Overall Score: ${scan.score}/100\n`;
    report += `Status: ${scan.passed ? 'PASSED' : 'FAILED'}\n\n`;

    const bySeverity = scan.issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    report += `## Summary\n`;
    report += `- Critical: ${bySeverity.critical || 0}\n`;
    report += `- High: ${bySeverity.high || 0}\n`;
    report += `- Medium: ${bySeverity.medium || 0}\n`;
    report += `- Low: ${bySeverity.low || 0}\n`;
    report += `- Info: ${bySeverity.info || 0}\n\n`;

    report += `## Issues\n\n`;
    for (const issue of scan.issues) {
      report += `### [${issue.severity.toUpperCase()}] ${issue.title}\n`;
      report += `**Category:** ${issue.category}\n`;
      report += `**Description:** ${issue.description}\n`;
      report += `**Remediation:** ${issue.remediation}\n`;
      if (issue.location) report += `**Location:** ${issue.location}\n`;
      report += `\n`;
    }

    return report;
  }
}