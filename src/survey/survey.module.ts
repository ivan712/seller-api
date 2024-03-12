import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { SurveyQuestionsRepository } from './repositories/survey-questions.repository';
import { PrismaService } from 'src/db/prisma.service';
import { SurveyAnswersRepository } from './repositories/survey-answers.repository';

@Module({
  providers: [
    SurveyService,
    SurveyQuestionsRepository,
    SurveyAnswersRepository,
    PrismaService,
  ],
  controllers: [SurveyController],
})
export class SurveyModule {}
