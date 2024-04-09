import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateAnswerDto } from './create-answer.dto';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { Roles } from '../auth/jwt/decorators/roles.decorator';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { Role } from '../user/roles.enum';
import { User } from '../auth/jwt/decorators/user.decorator';
import { OK_MESSAGE } from '../messages.constant';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  apiAnswerQuestionsSchema,
  badRequestNotFoundOrgSchema,
  successAnswerQuestionsSchema,
} from './swagger/answer-questions.schema';
import {
  invalidAccessTokenSchema,
  successGetUserAnswerSchema,
} from './swagger/get-answers.schema';
import { ValidationDataPipe } from '../validation.pipe';

@ApiTags('Survey')
@Controller('v1/survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post('answer')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationDataPipe)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Answer the questions' })
  @ApiBody(apiAnswerQuestionsSchema)
  @ApiResponse(successAnswerQuestionsSchema)
  @ApiResponse(badRequestNotFoundOrgSchema)
  async answerQuestions(
    @User() { id }: { id: string },
    @Body() answers: CreateAnswerDto,
  ) {
    await this.surveyService.answerQuestions(id, answers);
    return { message: OK_MESSAGE };
  }

  @Get('answer')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "User's answers" })
  @ApiResponse(successGetUserAnswerSchema)
  @ApiResponse(invalidAccessTokenSchema)
  async getUserAnswers(@User() { id }: { id: string }) {
    return this.surveyService.getUserAnswers(id);
  }
}
