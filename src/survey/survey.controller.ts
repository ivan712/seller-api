import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SurveyService } from './survey.service';
import { OK_MESSAGE } from '../messages.constant';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaClientExceptionFilter } from './question-fkey-exception.filter';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { TokenInfo } from '../auth/jwt/decorators/token.decorator';

@Controller('v1/survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createQuestion(@Body() dto: CreateQuestionDto) {
    await this.surveyService.createQuestion(dto.question);

    return {
      message: OK_MESSAGE,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllQuestions() {
    return this.surveyService.getAllQuestions();
  }

  @Put('answer')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new PrismaClientExceptionFilter())
  async answerQuestions(
    @TokenInfo() { userId }: { userId: string },
    @Body() answers: CreateAnswerDto[],
  ) {
    return this.surveyService.answerQuestions(userId, answers);
  }

  @Get('answer')
  @UseGuards(JwtAuthGuard)
  async getUserAnswers(@TokenInfo() { userId }: { userId: string }) {
    return this.surveyService.getUserAnswers(userId);
  }
}
