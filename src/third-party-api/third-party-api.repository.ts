import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { IThirdPartyApiRepository } from './interfaces/third-party-token-repository.interface';
import { IUpsertApiData } from './interfaces/upsert-api-data.interface';
import { ThirdPartyApi } from './third-parti-api.entity';

@Injectable()
export class ThirdPartyApiRepository implements IThirdPartyApiRepository {
  constructor(private prisma: PrismaService) {}

  async upsert(data: IUpsertApiData): Promise<void> {
    await this.prisma.thirdPartyApi.upsert({
      where: {
        key: data.key,
      },
      create: {
        key: data.key,
        url: data.url,
        token: data.token,
        expiredAt: data.expiredAt.toISOString(),
      },
      update: {
        url: data.url,
        token: data.token,
        expiredAt: data.expiredAt.toISOString(),
      },
    });
  }

  async delete(key: string): Promise<void> {
    await this.prisma.thirdPartyApi.delete({
      where: {
        key,
      },
    });
  }

  async getByKey(key: string): Promise<ThirdPartyApi | null> {
    const pgDoc = await this.prisma.thirdPartyApi.findUnique({
      where: { key },
    });

    if (!pgDoc) return null;
    return new ThirdPartyApi({ pgDoc });
  }
}
