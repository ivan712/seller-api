import { Inject, Injectable } from '@nestjs/common';
import { ISurveyQuestionsRepository } from './interfaces/survey-questions.interface';
import { SurveyQuestion } from './entities/question.entity';
import { SurveyQuestionsRepository } from './repositories/survey-questions.repository';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyQuestionsRepository)
    private surveyQuestionRepository: ISurveyQuestionsRepository,
  ) {}

  async createQuestion(question: string): Promise<void> {
    await this.surveyQuestionRepository.create(question);
  }

  async getAllQuestions(): Promise<SurveyQuestion[]> {
    return this.surveyQuestionRepository.getAll();
  }
}
