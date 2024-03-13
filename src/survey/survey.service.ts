import { Inject, Injectable } from '@nestjs/common';
import { SurveyAnswer } from './answer.entity';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { ISurveyAnswersRepository } from './survey-answers.interface';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyAnswersRepository)
    private surveyAnswersRepository: ISurveyAnswersRepository,
  ) {}

  async answerQuestions(userId: string, answers: SurveyAnswer): Promise<void> {
    await this.surveyAnswersRepository.upsert(userId, answers);
  }

  async getUserAnswers(userId: string): Promise<SurveyAnswer> {
    return this.surveyAnswersRepository.getAnswersByUserId(userId);
  }
}
