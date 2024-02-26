import { ThirdPartyApi } from '../third-parti-api.entity';
import { IUpsertApiData } from './upsert-api-data.interface';

export interface IThirdPartyApiRepository {
  upsert(data: IUpsertApiData): Promise<void>;
  delete(key: string): Promise<void>;
  getByKey(key: string): Promise<ThirdPartyApi | null>;
}
