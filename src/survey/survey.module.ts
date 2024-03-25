import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { PrismaService } from '../db/prisma.service';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { UserModule } from '../user/user.module';
import { RabbitModule } from '../rabbit/rabbit.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [UserModule, RabbitModule, OrganizationModule],
  providers: [SurveyService, SurveyAnswersRepository, PrismaService],
  controllers: [SurveyController],
})
export class SurveyModule {}
