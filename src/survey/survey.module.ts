import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { PrismaService } from '../db/prisma.service';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SurveyService, SurveyAnswersRepository, PrismaService],
  controllers: [SurveyController],
})
export class SurveyModule {}
