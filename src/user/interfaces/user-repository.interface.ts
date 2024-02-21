import { User } from '../user.entity';
import { ICreateUser } from './create-user.interface';

export interface IUserRepository {
  create(userInfo: ICreateUser): Promise<User>;
  getByPhone(phoneNumber: string): Promise<User | null>;
  update(
    userData: Partial<Omit<User, 'id'>>,
    phoneNumber: string,
    dbOptions?: object,
  ): Promise<void>;
}
