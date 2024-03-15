import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';
import { PrismaService } from '../db/prisma.service';
import { Repository } from '../db/repository';
import { IDbOptions } from '../db/db-options.interface';

@Injectable()
export class UserRepository extends Repository implements IUserRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(userInfo: ICreateUser, dbOptions?: IDbOptions): Promise<User> {
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

  async getById(id: string, dbOptions?: IDbOptions): Promise<User | null> {
    const user = await this.getClient(dbOptions).user.findUnique({
      include: {
        organisation: true,
      },
      where: {
        id,
      },
    });

    if (!user) return null;

    return new User({ pgDoc: user });
  }

  async getByPhone(
    phoneNumber: string,
    dbOptions?: IDbOptions,
  ): Promise<User | null> {
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
    userId: string,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    const updateData = userData.organisationId
      ? { ...userData, organisationId: userData.organisationId }
      : userData;
    console.log('updateData', updateData.organisationId);
    console.log('userId', userId);
    await this.getClient(dbOptions).user.update({
      data: updateData,
      where: { id: userId },
    });
  }
}
