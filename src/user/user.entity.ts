import { Role } from './roles.enum';
import { UserStatus } from './user.status';
import { User as UserModel } from '@prisma/client';

export class User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;
  verificationCode?: string;
  status?: UserStatus;
  codeExpiredAt?: string;

  constructor({ pgDoc }: { pgDoc: UserModel }) {
    this.id = String(pgDoc.id);
    this.name = pgDoc.name;
    this.phoneNumber = pgDoc.phoneNumber;
    this.role = pgDoc.role as Role;
    this.passwordHash = pgDoc.passwordHash;
    this.verificationCode = pgDoc.verificationCode;
    this.status = pgDoc.status as UserStatus;
    this.codeExpiredAt = pgDoc.codeExpiredAt;
  }

  getUserInfo() {
    return {
      name: this.name,
      phoneNumber: this.name,
      role: this.name,
      passwordHash: this.name,
      verificationCode: this.name,
      status: this.name,
    };
  }
}
