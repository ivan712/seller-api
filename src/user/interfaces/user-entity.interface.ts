import { Role } from '../roles.enum';
import { UserStatus } from '../user.status';

export interface IUser {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  passwordHash?: string;
  verificationCode?: string;
  status?: UserStatus;
  codeExpiredAt?: Date;
}
