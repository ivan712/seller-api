import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';
import { OK_MESSAGE } from '../messages.constant';

@Controller('v1/survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async createQuestion(@Body() dto: CreateQuestionDto) {
    await this.surveyService.createQuestion(dto.question);

    return {
      message: OK_MESSAGE,
    };
  }

  @Get('all')
  async getAllQuestions() {
    return this.surveyService.getAllQuestions();
  }
}
