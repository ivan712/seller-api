import { Organisation } from '../organisation.entity';
import { ICreateOrganisationData } from './create-organisation.interface';

export interface IOrganisationRepository {
  create(data: ICreateOrganisationData, dbOptions?: any): Promise<Organisation>;
  getByInn(inn: string, dbOptions?: any): Promise<Organisation | null>;
  updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
    dbOptions?: any,
  ): Promise<void>;
}
