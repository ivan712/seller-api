import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';

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

  async getById(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  async setPassword(passwordHash: string, phoneNumber: string) {
    await this.userRepository.update({ passwordHash }, phoneNumber);
  }
}
