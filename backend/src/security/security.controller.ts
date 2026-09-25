import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../common/guards/organization-member.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PasswordStrengthService } from './password-strength.service';
import { SecurityAuditService } from './security-audit.service';

@ApiTags('Security')
@Controller('security')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class SecurityController {
  constructor(
    private readonly passwordStrengthService: PasswordStrengthService,
    private readonly securityAuditService: SecurityAuditService,
  ) {}

  @Post('password/check')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Check password strength' })
  @ApiResponse({ status: 200, description: 'Password strength analysis' })
  async checkPassword(@Body('password') password: string) {
    return this.passwordStrengthService.checkPassword(password);
  }

  @Get('password/requirements')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get password requirements' })
  @ApiResponse({ status: 200, description: 'Password requirements' })
  getPasswordRequirements() {
    return this.passwordStrengthService.getRequirements();
  }

  @Post('audit/scan')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Run security audit scan' })
  @ApiResponse({ status: 200, description: 'Security audit results' })
  async runSecurityScan() {
    return this.securityAuditService.runFullScan();
  }

  @Get('audit/report')
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Get security audit report' })
  @ApiResponse({ status: 200, description: 'Security audit report as markdown' })
  async getSecurityReport() {
    const report = await this.securityAuditService.generateReport();
    return { report };
  }
}