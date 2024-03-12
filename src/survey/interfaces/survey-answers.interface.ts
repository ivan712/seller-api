import { SurveyAnswer } from '../entities/answer.entity';

export interface ISurveyAnswersRepository {
  getAnswersByUserId(id: string): Promise<SurveyAnswer[]>;
  deleteByUserId(
    userId: string,
    questionId: number,
    dbOptions?: any,
  ): Promise<void>;
  upsertMany(
    userId: string,
    answers: SurveyAnswer[],
    dbOptions?: any,
  ): Promise<void>;
}
