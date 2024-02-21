import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { Organisation } from './organisation.entity';

@Injectable()
export class OrganisationRepository implements IOrganisationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateOrganisationData): Promise<any> {
    return this.prisma.organisation.create({ data });
  }

  async getByInn(inn: string): Promise<Organisation | null> {
    const pgDoc = await this.prisma.organisation.findFirst({ where: { inn } });
    if (!pgDoc) return null;
    return new Organisation({ pgDoc });
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
  ): Promise<void> {
    await this.prisma.organisation.update({
      where: {
        inn,
      },
      data,
    });
  }
}
