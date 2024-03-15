import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateAnswerDto } from './create-answer.dto';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { Roles } from '../auth/jwt/decorators/roles.decorator';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { Role } from '../user/roles.enum';
import { User } from '../auth/jwt/decorators/user.decorator';
import { OK_MESSAGE } from 'src/messages.constant';

@Controller('v1/survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('answer')
  async answerQuestions(
    @User() { id }: { id: string },
    @Body() answers: CreateAnswerDto,
  ) {
    await this.surveyService.answerQuestions(id, answers);
    return { message: OK_MESSAGE };
  }

  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('answer')
  async getUserAnswers(@User() { id }: { id: string }) {
    return this.surveyService.getUserAnswers(id);
  }
}
