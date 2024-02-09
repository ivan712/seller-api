import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(userInfo: ICreateUser): Promise<User> {
    return new User({
      pgDoc: await this.prisma.user.create({
        data: {
          ...userInfo,
          organisationId: null,
          passwordHash: null,
        },
      }),
    });
  }

  async getByPhone(phoneNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) return null;

    return new User({ pgDoc: user });
  }

  async update(
    userData: Partial<Omit<User, 'id'>>,
    phoneNumber: string,
  ): Promise<void> {
    console.log(userData);
    await this.prisma.user.update({
      data: { ...userData },
      where: { phoneNumber },
    });
  }
}
