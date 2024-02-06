import { ICreateUser } from './create-user.interface';
import { User } from '../user.model';

export interface IUserRepository {
  create(userInfo: ICreateUser): Promise<User>;
  getByPhone(phoneNumber: string): Promise<User | null>;
  update(userData: Partial<User>, phoneNumber: string): Promise<void>;
}
