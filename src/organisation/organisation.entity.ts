export enum OrgType {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum OrgStatus {
  WAIT_REGISTRATION_CONFIRM = 'wait',
  REGISTERED = 'registred',
}

export class Organisation {
  id: string;
  inn: string;
  name: string;
  type: OrgType;
  ogrn: string;
  legalAddress: string;
  status: OrgStatus;

  constructor({ pgDoc }: { pgDoc: any }) {
    this.id = pgDoc.id;
    this.inn = pgDoc.inn;
    this.name = pgDoc.name;
    this.type = pgDoc.type;
    this.ogrn = pgDoc.ogrn;
    this.legalAddress = pgDoc.legalAddress;
    this.status = pgDoc.status;
  }
}
