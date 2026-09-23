import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../leads/lead.entity';
import { Deal } from '../deals/deal.entity';
import { Task } from '../tasks/task.entity';
import { Activity } from '../activities/activity.entity';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';
import { OrganizationMember } from '../organizations/entities/organization-member.entity';
import { OrganizationsModule } from '../organizations/organizations.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Deal, Task, Activity, User, Customer, OrganizationMember]),
    OrganizationsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
