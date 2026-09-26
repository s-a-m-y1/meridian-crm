import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationSettings } from './entities/organization-settings.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationMember, OrganizationSettings])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}