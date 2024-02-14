import { Role } from '../roles.enum';

export interface ICreateUser {
  phoneNumber: string;
  name: string;
  role: Role;
}
