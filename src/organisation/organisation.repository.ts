import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { Organisation } from './organisation.entity';

@Injectable()
export class OrganisationRepository implements IOrganisationRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(dbOptions?: any): PrismaService {
    const trxn = dbOptions?.trxn;
    return trxn ? trxn : this.prisma;
  }

  async create(
    data: ICreateOrganisationData,
    dbOptions?: any,
  ): Promise<Organisation> {
    const pgDoc = await this.getClient(dbOptions).organisation.create({ data });
    return new Organisation({ pgDoc });
  }

  async getByInn(inn: string, dbOptions?: any): Promise<Organisation | null> {
    const pgDoc = await this.getClient(dbOptions).organisation.findFirst({
      where: { inn },
    });
    if (!pgDoc) return null;
    return new Organisation({ pgDoc });
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
    dbOptions?: any,
  ): Promise<void> {
    await this.getClient(dbOptions).organisation.update({
      where: {
        inn,
      },
      data,
    });
  }
}
