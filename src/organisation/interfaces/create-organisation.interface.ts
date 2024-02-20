import { OrgStatus, OrgType } from '../organisation.entity';

export interface ICreateOrganisationData {
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  legalAddress: string;
  status: OrgStatus;
}
