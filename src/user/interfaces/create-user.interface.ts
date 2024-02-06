import { Role } from '../roles.enum';
import { UserStatus } from '../user.status';

export interface ICreateUser {
  phoneNumber: string;
  name: string;
  role: Role;
  verificationCode: number;
  status: UserStatus;
}
