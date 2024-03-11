import { SurveyQuestion } from '../entities/question.entity';

export interface ISurveyAnswersRepository {
  create(
    userId: string,
    questionId: number,
    answer: string,
    dbOptions?: any,
  ): Promise<void>;
  getAnswersByUserId(
    id: string,
    dbOptions?: any,
  ): Promise<SurveyQuestion | null>;
  delete(id: string, dbOptions?: any): Promise<void>;
  update(
    id: string,
    data: Omit<SurveyQuestion, 'id'>,
    dbOptions?: any,
  ): Promise<void>;
  getAll(): Promise<SurveyQuestion[]>;
}
