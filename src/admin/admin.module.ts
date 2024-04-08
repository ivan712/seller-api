import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { OrganizationModule } from '../organization/organization.module';
import { SurveyModule } from '../survey/survey.module';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [OrganizationModule, SurveyModule, UserModule],
  providers: [AdminService, ConfigService],
  controllers: [AdminController],
})
export class AdminModule {}
