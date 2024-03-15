import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';
import { PrismaService } from '../../db/prisma.service';
import { Repository } from '../../db/repository';
import { IDbOptions } from '../../db/db-options.interface';

@Injectable()
export class RefreshTokenRepository
  extends Repository
  implements IRefreshTokenRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async add(
    token: string,
    userId: string,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).refreshToken.create({
      data: { token, userId },
    });
  }

  async update(
    oldToken,
    newToken: string,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).refreshToken.update({
      where: {
        token: oldToken,
      },
      data: {
        token: newToken,
      },
    });
  }

  async deleteOne(token: string, dbOptions?: IDbOptions): Promise<void> {
    await this.getClient(dbOptions).refreshToken.delete({ where: { token } });
  }

  async deleteAll(userId: string, dbOptions?: IDbOptions): Promise<void> {
    await this.getClient(dbOptions).refreshToken.deleteMany({
      where: { userId },
    });
  }

  async getOne(token: string, dbOptions?: IDbOptions): Promise<string | null> {
    const tokenInfo = await this.getClient(dbOptions).refreshToken.findUnique({
      where: { token },
    });
    if (!tokenInfo) return null;

    return tokenInfo.token;
  }

  async count(userId: string, dbOptions?: IDbOptions): Promise<Number> {
    return this.getClient(dbOptions).refreshToken.count({
      where: {
        userId,
      },
    });
  }
}
