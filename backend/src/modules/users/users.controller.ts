import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Current user profile' })
  async me(@CurrentUser() user: { id: string }) {
    const found = await this.users.findById(user.id);
    return found
      ? { id: found.id, email: found.email, name: found.name }
      : null;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.users.updateProfile(user.id, dto);
    return { id: updated.id, email: updated.email, name: updated.name };
  }
}
