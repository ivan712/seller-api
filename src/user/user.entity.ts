import { Organization } from '../organization/organization.entity';
import { Role } from './roles.enum';
import { User as UserModel } from '@prisma/client';
import { Organization as OrgModel } from '@prisma/client';

export class User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;
  organizationId?: string;
  organization?: Organization;

  constructor({ pgDoc }: { pgDoc: UserModel & { organization?: OrgModel } }) {
    this.id = pgDoc.id;
    this.name = pgDoc.name;
    this.phoneNumber = pgDoc.phoneNumber;
    this.role = pgDoc.role as Role;
    this.passwordHash = pgDoc.passwordHash;
    this.organizationId = pgDoc.organizationId
      ? String(pgDoc.organizationId)
      : null;
    this.organization = pgDoc.organization
      ? new Organization({ pgDoc: pgDoc.organization })
      : null;
  }

  getUserInfo() {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      role: this.role,
      org: this.organization,
    };
  }
}
