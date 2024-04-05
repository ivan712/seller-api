import { OrgStatus, OrgTaxSystem, OrgType } from '../organization.entity';

export interface ICreateOrganizationData {
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  taxSystem: OrgTaxSystem;
  legalAddress: string;
  status: OrgStatus;
  adminComment?: string;
}
