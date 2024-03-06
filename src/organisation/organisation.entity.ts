import { Organisation as OrganisationModel } from '@prisma/client';
import { IApiDocDadata } from './interfaces/dadata-api-doc.interface';

export enum OrgType {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum OrgStatus {
  SENT_TO_MODERATION = 'sent_to_moderation',
  ON_MODERATION = 'on_moderation',
  REGISTRED = 'registered',
  REJECTED = 'rejected',
}

export class Organisation {
  id?: string;
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  legalAddress: string;
  status?: OrgStatus;

  constructor({
    pgDoc,
    apiDoc,
  }: {
    pgDoc?: OrganisationModel;
    apiDoc?: IApiDocDadata;
  }) {
    if (pgDoc) {
      this.id = String(pgDoc.id);
      this.inn = pgDoc.inn;
      this.name = pgDoc.name;
      this.type = pgDoc.type as OrgType;
      this.ogrn = pgDoc.ogrn;
      this.legalAddress = pgDoc.legalAddress;
      this.status = pgDoc.status as OrgStatus;
    } else if (apiDoc) {
      this.inn = apiDoc.data.inn;
      this.name = apiDoc.unrestricted_value;
      this.type = apiDoc.data.type;
      this.ogrn = apiDoc.data.ogrn;
      this.legalAddress = apiDoc.data.address.unrestricted_value;
    }
  }
}
