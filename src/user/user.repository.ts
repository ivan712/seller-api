import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { User } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async create(userInfo: ICreateUser): Promise<User> {
    // const codeExpiredAt = new Date();
    return new User({ pgDoc: await this.userModel.create({ ...userInfo }) });
  }

  async getByPhone(phoneNumber: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { phoneNumber } });
    if (!user) return null;

    return new User({ pgDoc: user });
  }

  async update(userData: Partial<User>, phoneNumber: string): Promise<void> {
    await this.userModel.update(userData, { where: { phoneNumber } });
  }
}
