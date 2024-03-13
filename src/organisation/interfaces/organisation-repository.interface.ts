import { IDbOptions } from '../../shared/db-options.interface';
import { Organisation } from '../organisation.entity';
import { ICreateOrganisationData } from './create-organisation.interface';

export interface IOrganisationRepository {
  create(
    data: ICreateOrganisationData,
    dbOptions?: IDbOptions,
  ): Promise<Organisation>;
  getByInn(inn: string, dbOptions?: IDbOptions): Promise<Organisation | null>;
  updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
    dbOptions?: IDbOptions,
  ): Promise<void>;
}
