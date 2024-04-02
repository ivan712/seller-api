import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { OrganizationModule } from '../organization/organization.module';
import { SurveyModule } from '../survey/survey.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [OrganizationModule, SurveyModule],
  providers: [AdminService, ConfigService],
  controllers: [AdminController],
})
export class AdminModule {}
