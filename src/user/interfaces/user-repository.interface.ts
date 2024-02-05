import { ICreateUser } from './create-user.interface';
import { User } from '../user.model';

export interface IUserRepository {
  create(userInfo: ICreateUser): Promise<User>;
  getByPhone(phoneNumber: string): Promise<User | null>;
  getById(id: string): Promise<User>;
  setPassword(password: string, id: string): Promise<void>;
}
