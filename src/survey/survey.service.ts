import { Inject, Injectable } from '@nestjs/common';
import { ISurveyQuestionsRepository } from './interfaces/survey-questions.interface';
import { SurveyQuestion } from './entities/question.entity';
import { SurveyQuestionsRepository } from './repositories/survey-questions.repository';
import { SurveyAnswer } from './entities/answer.entity';
import { SurveyAnswersRepository } from './repositories/survey-answers.repository';
import { ISurveyAnswersRepository } from './interfaces/survey-answers.interface';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyQuestionsRepository)
    private surveyQuestionRepository: ISurveyQuestionsRepository,
    @Inject(SurveyAnswersRepository)
    private surveyAnswersRepository: ISurveyAnswersRepository,
  ) {}

  async createQuestion(question: string): Promise<void> {
    await this.surveyQuestionRepository.create(question);
  }

  async getAllQuestions(): Promise<SurveyQuestion[]> {
    return this.surveyQuestionRepository.getAll();
  }

  async answerQuestions(
    userId: string,
    answers: SurveyAnswer[],
  ): Promise<void> {
    await this.surveyAnswersRepository.upsertMany(userId, answers);
  }

  async getUserAnswers(userId: string): Promise<SurveyAnswer[]> {
    return this.surveyAnswersRepository.getAnswersByUserId(userId);
  }
}
