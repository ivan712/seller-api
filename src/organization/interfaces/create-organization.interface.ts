import { OrgStatus, OrgType } from '../organization.entity';

export interface ICreateOrganizationData {
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  legalAddress: string;
  status: OrgStatus;
  adminComment?: string;
}
