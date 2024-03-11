import { SurveyQuestion } from '../entities/question.entity';

export interface ISurveyQuestionsRepository {
  create(question: string, dbOptions?: any): Promise<void>;
  getById(id: string, dbOptions?: any): Promise<SurveyQuestion | null>;
  delete(id: string, dbOptions?: any): Promise<void>;
  update(
    id: string,
    data: Omit<SurveyQuestion, 'id'>,
    dbOptions?: any,
  ): Promise<void>;
  getAll(): Promise<SurveyQuestion[]>;
}
