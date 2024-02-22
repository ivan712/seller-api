import { IUpsertTokenData } from './upsert-token-data.interface';

export interface IThirdPartyTokenRepository {
  upsert(data: IUpsertTokenData): Promise<void>;
  delete(key: string): Promise<void>;
  getByKey(key: string);
}
