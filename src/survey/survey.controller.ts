import { Body, Controller, Get, Post, Put, UseFilters } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';
import { OK_MESSAGE } from '../messages.constant';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaClientExceptionFilter } from './question-fkey-exception.filter';

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

  @Put('answer')
  @UseFilters(new PrismaClientExceptionFilter())
  async answerQuestions(@Body() answers: CreateAnswerDto[]) {
    console.log('answers 1', answers);
    return this.surveyService.answerQuestions('1', answers);
  }

  @Get('answer')
  async getUserAnswers() {
    return this.surveyService.getUserAnswers('1');
  }
}
