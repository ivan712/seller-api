import { IDbOptions } from '../db/db-options.interface';
import { SurveyAnswer } from './answer.entity';

export interface ISurveyAnswersRepository {
  getAnswersByUserId(id: string): Promise<SurveyAnswer | null>;
  deleteByUserId(userId: string, dbOptions?: IDbOptions): Promise<void>;
  create(
    userId: string,
    answers: SurveyAnswer,
    dbOptions?: IDbOptions,
  ): Promise<void>;
  upsert(
    userId: string,
    answers: SurveyAnswer,
    dbOptions?: IDbOptions,
  ): Promise<void>;
}
