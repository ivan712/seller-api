import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserRepository } from './interfaces/user-repository.interface';
import { User } from './user.model';
import { ICreateUser } from './interfaces/create-user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private userRepository: IUserRepository,
  ) {}

  async create(userInfo: ICreateUser): Promise<User> {
    return this.userRepository.create(userInfo);
  }

  async getByPhone(phoneNumber: string): Promise<User | null> {
    return this.userRepository.getByPhone(phoneNumber);
  }

  async setPassword(password: string, phoneNumber) {
    const user = await this.getByPhone(phoneNumber);

    //hardcode
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.setPassword(password, user.id);
  }
}
