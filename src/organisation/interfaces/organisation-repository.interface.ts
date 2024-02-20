import { Organisation } from '../organisation.entity';
import { ICreateOrganisationData } from './create-organisation.interface';

export interface IOrganisationRepository {
  create(data: ICreateOrganisationData): Promise<void>;
  getByInn(inn: string): Promise<Organisation | null>;
}
