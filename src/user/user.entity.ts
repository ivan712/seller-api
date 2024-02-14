import { Role } from './roles.enum';
import { User as UserModel } from '@prisma/client';

export class User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;

  constructor({ pgDoc }: { pgDoc: UserModel }) {
    this.id = String(pgDoc.id);
    this.name = pgDoc.name;
    this.phoneNumber = pgDoc.phoneNumber;
    this.role = pgDoc.role as Role;
    this.passwordHash = pgDoc.passwordHash;
  }

  getUserInfo() {
    return {
      name: this.name,
      phoneNumber: this.phoneNumber,
      role: this.role,
    };
  }
}
