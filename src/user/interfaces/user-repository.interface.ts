import { User } from '../user.entity';
import { ICreateUser } from './create-user.interface';

export interface IUserRepository {
  create(userInfo: ICreateUser, dbOptions?: any): Promise<User>;
  getByPhone(phoneNumber: string, dbOptions?: any): Promise<User | null>;
  getById(id: string, dbOptions?: any): Promise<User | null>;
  update(
    userData: Partial<Omit<User, 'id'>>,
    phoneNumber: string,
    dbOptions?: any,
  ): Promise<void>;
}
