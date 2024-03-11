import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(dbOptions?: any) {
    const trxn = dbOptions?.trxn;
    return trxn ? trxn : this.prisma;
  }

  async create(userInfo: ICreateUser, dbOptions?: any): Promise<User> {
    return new User({
      pgDoc: await this.getClient(dbOptions).user.create({
        data: {
          ...userInfo,
          organisationId: null,
          passwordHash: null,
        },
      }),
    });
  }

  async getByPhone(phoneNumber: string, dbOptions?: any): Promise<User | null> {
    const user = await this.getClient(dbOptions).user.findUnique({
      include: {
        organisation: true,
      },
      where: {
        phoneNumber,
      },
    });

    if (!user) return null;

    return new User({ pgDoc: user });
  }

  async update(
    userData: Partial<Omit<User, 'id' | 'organisation'>>,
    phoneNumber: string,
    dbOptions?: any,
  ): Promise<void> {
    const updateData = userData.organisationId
      ? { ...userData, organisationId: Number(userData.organisationId) }
      : userData;
    await this.getClient(dbOptions).user.update({
      data: updateData,
      where: { phoneNumber },
    });
  }
}
