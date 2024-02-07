import { Role } from './roles.enum';
import { UserStatus } from './user.status';
import { UserModel } from './user.model';

export class User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;
  verificationCode?: string;
  status?: UserStatus;
  codeExpiredAt?: Date;

  constructor({ pgDoc }: { pgDoc: UserModel }) {
    this.id = pgDoc.id;
    this.name = pgDoc.name;
    this.phoneNumber = pgDoc.phoneNumber;
    this.role = pgDoc.role;
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
