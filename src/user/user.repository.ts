import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(userInfo: ICreateUser): Promise<User> {
    // const codeExpiredAt = new Date();
    return await this.userModel.create({ ...userInfo });
  }

  async getByPhone(phoneNumber: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { phoneNumber } });

    if (!user) return null;

    return user;
  }

  async update(userData: Partial<User>, phoneNumber: string): Promise<void> {
    await this.userModel.update(userData, { where: { phoneNumber } });
  }
}
