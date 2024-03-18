import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { PrismaService } from '../db/prisma.service';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { UserModule } from '../user/user.module';
import { RabbitModule } from '../rabbit/rabbit.module';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [UserModule, RabbitModule, OrganisationModule],
  providers: [SurveyService, SurveyAnswersRepository, PrismaService],
  controllers: [SurveyController],
})
export class SurveyModule {}
