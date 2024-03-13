import { IDbOptions } from '../shared/db-options.interface';
import { SurveyAnswer } from './answer.entity';

export interface ISurveyAnswersRepository {
  getAnswersByUserId(id: string): Promise<SurveyAnswer>;
  deleteByUserId(userId: string, dbOptions?: IDbOptions): Promise<void>;
  upsert(
    userId: string,
    answers: SurveyAnswer,
    dbOptions?: IDbOptions,
  ): Promise<void>;
}
