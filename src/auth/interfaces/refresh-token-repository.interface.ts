import { IDbOptions } from '../../db/db-options.interface';

export interface IRefreshTokenRepository {
  add(token: string, userId: string, dbOptions?: IDbOptions): Promise<void>;
  update(token: string, userId: string, dbOptions?: IDbOptions): Promise<void>;
  deleteOne(token: string, dbOptions?: IDbOptions): Promise<void>;
  deleteAll(userId: string, dbOptions?: IDbOptions): Promise<void>;
  getOne(token: string, dbOptions?: IDbOptions): Promise<string>;
}
