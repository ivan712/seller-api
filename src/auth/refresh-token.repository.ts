import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from './interfaces/refresh-token-repository.interface';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async add(token: string, userId: string): Promise<void> {
    await this.prisma.refreshTokenModel.create({
      data: { token, userId: Number(userId) },
    });
  }

  async update(oldToken, newToken: string): Promise<void> {
    await this.prisma.refreshTokenModel.update({
      where: {
        token: oldToken,
      },
      data: {
        token: newToken,
      },
    });
  }

  async delete(token: string): Promise<void> {
    await this.prisma.refreshTokenModel.delete({ where: { token } });
  }

  async getOne(token: string): Promise<string | null> {
    const tokenInfo = await this.prisma.refreshTokenModel.findUnique({
      where: { token },
    });
    if (!tokenInfo) return null;

    return tokenInfo.token;
  }
}
