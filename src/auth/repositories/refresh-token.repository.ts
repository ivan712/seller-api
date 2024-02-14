import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async add(token: string, userId: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { token, userId: Number(userId) },
    });
  }

  async update(oldToken, newToken: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: {
        token: oldToken,
      },
      data: {
        token: newToken,
      },
    });
  }

  async deleteOne(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { token } });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId: Number(userId) },
    });
  }

  async getOne(token: string): Promise<string | null> {
    const tokenInfo = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    if (!tokenInfo) return null;

    return tokenInfo.token;
  }

  async count(userId: string): Promise<Number> {
    return this.prisma.refreshToken.count({
      where: {
        userId: Number(userId),
      },
    });
  }
}
