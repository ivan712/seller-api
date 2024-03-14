import { IDbOptions } from '../../shared/db-options.interface';
import { User } from '../user.entity';
import { ICreateUser } from './create-user.interface';

export interface IUserRepository {
  create(userInfo: ICreateUser, dbOptions?: IDbOptions): Promise<User>;
  getByPhone(phoneNumber: string, dbOptions?: IDbOptions): Promise<User | null>;
  getById(id: string, dbOptions?: IDbOptions): Promise<User | null>;
  update(
    userData: Partial<Omit<User, 'id'>>,
    phoneNumber: string,
    dbOptions?: IDbOptions,
  ): Promise<void>;
}
