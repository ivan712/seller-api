import { Organisation } from '../organisation.entity';
import { ICreateOrganisationData } from './create-organisation.interface';

export interface IOrganisationRepository {
  create(data: ICreateOrganisationData): Promise<any>;
  getByInn(inn: string): Promise<Organisation | null>;
  updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
  ): Promise<void>;
}
