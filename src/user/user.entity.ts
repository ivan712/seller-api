import { Organisation } from '../organisation/organisation.entity';
import { Role } from './roles.enum';
import { User as UserModel } from '@prisma/client';
import { Organisation as OrgModel } from '@prisma/client';

export class User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;
  organisationId?: string;
  organisation?: Organisation;

  constructor({ pgDoc }: { pgDoc: UserModel & { organisation?: OrgModel } }) {
    this.id = String(pgDoc.id);
    this.name = pgDoc.name;
    this.phoneNumber = pgDoc.phoneNumber;
    this.role = pgDoc.role as Role;
    this.passwordHash = pgDoc.passwordHash;
    this.organisationId = pgDoc.organisationId
      ? String(pgDoc.organisationId)
      : null;
    this.organisation = pgDoc.organisation
      ? new Organisation({ pgDoc: pgDoc.organisation })
      : null;
  }

  getUserInfo() {
    return {
      name: this.name,
      phoneNumber: this.phoneNumber,
      role: this.role,
      org: this.organisation,
    };
  }
}
