import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto, RefreshResponseDto } from './dto/refresh.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and organization' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and receive access + refresh tokens' })
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate access token using refresh token' })
  async refresh(@Body() dto: RefreshDto): Promise<RefreshResponseDto> {
    return this.auth.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @ApiOperation({ summary: 'Logout — revoke refresh token' })
  async logout(@Req() req: Request) {
    const refreshToken = (req.body as { refreshToken?: string })?.refreshToken;
    if (refreshToken) await this.auth.logout(refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset (dev returns token)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.auth.resetPassword(dto);
    return { message: 'Password reset successful' };
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address with token' })
  async verifyEmail(@Query('token') token: string): Promise<{ message: string }> {
    await this.auth.verifyEmail(token);
    return { message: 'Email verified successfully. You can now log in.' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: { id: string; email: string; name: string }) {
    return user;
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password (revokes all other sessions)' })
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    await this.auth.changePassword(user.id, dto.currentPassword, dto.newPassword);
    return { message: 'Password updated successfully' };
  }
}
