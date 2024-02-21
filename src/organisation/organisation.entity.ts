export enum OrgType {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum OrgStatus {
  WAIT_REGISTRATION_CONFIRM = 'wait',
  REGISTERED = 'registred',
}

export class Organisation {
  id?: string;
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  legalAddress: string;
  status?: OrgStatus;

  constructor({ pgDoc, apiDoc }: { pgDoc?: any; apiDoc?: any }) {
    if (pgDoc) {
      this.id = pgDoc.id;
      this.inn = pgDoc.inn;
      this.name = pgDoc.name;
      this.type = pgDoc.type;
      this.ogrn = pgDoc.ogrn;
      this.legalAddress = pgDoc.legalAddress;
      this.status = pgDoc.status;
    } else if (apiDoc) {
      this.inn = apiDoc.data.inn;
      this.name = apiDoc.unrestricted_value;
      this.type = apiDoc.data.type;
      this.ogrn = apiDoc.data.ogrn;
      this.legalAddress = apiDoc.data.address.unrestricted_value;
    }
  }
}
