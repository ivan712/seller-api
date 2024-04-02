import { IDbOptions } from '../../db/db-options.interface';
import { Organization } from '../organization.entity';
import { ICreateOrganizationData } from './create-organization.interface';

export interface IOrganizationRepository {
  create(
    data: ICreateOrganizationData,
    dbOptions?: IDbOptions,
  ): Promise<Organization>;
  getByInn(inn: string, dbOptions?: IDbOptions): Promise<Organization | null>;
  getOrgInfoFromDadata(inn: string): Promise<Organization>;
  updateOrgData(
    inn: string,
    data: Partial<Omit<Organization, 'id' | 'inn'>>,
    dbOptions?: IDbOptions,
  ): Promise<void>;
  getByUserId(id: string, dbOptions?: IDbOptions): Promise<Organization | null>;
  getByOrgId(id: string, dbOptions?: IDbOptions): Promise<Organization | null>;
  getAll(dbOptions?: IDbOptions): Promise<Organization[]>;
}
