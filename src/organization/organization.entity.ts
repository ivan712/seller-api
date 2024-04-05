import { Organization as OrganizationModel } from '@prisma/client';
import { IApiDocDadata } from './interfaces/dadata-api-doc.interface';

export enum OrgType {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum OrgStatus {
  ON_MODERATION = 'on_moderation',
  REGISTRED = 'registered',
  REJECTED = 'rejected',
}

export enum OrgTaxSystem {
  OSNO = 'osno',
  USN_INCOME = 'usn_income',
  USN_INCOME_EXPENSES = 'usn_income_expenses',
}

export class Organization {
  id: string;
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  taxSystem?: OrgTaxSystem;
  legalAddress: string;
  status?: OrgStatus;
  adminComment?: string;

  constructor({
    pgDoc,
    apiDoc,
  }: {
    pgDoc?: OrganizationModel;
    apiDoc?: IApiDocDadata;
  }) {
    if (pgDoc) {
      this.id = pgDoc.id;
      this.inn = pgDoc.inn;
      this.name = pgDoc.name;
      this.type = pgDoc.type as OrgType;
      this.ogrn = pgDoc.ogrn;
      this.taxSystem = pgDoc.taxSystem as OrgTaxSystem;
      this.legalAddress = pgDoc.legalAddress;
      this.status = pgDoc.status as OrgStatus;
      this.adminComment = pgDoc.adminComment;
    } else if (apiDoc) {
      this.inn = apiDoc.data.inn;
      this.name = apiDoc.unrestricted_value;
      this.type = apiDoc.data.type;
      this.ogrn = apiDoc.data.ogrn;
      this.legalAddress = apiDoc.data.address.unrestricted_value;
    }
  }
}
