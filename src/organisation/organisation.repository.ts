import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { Organisation } from './organisation.entity';
import { IDbOptions } from '../shared/db-options.interface';
import { Repository } from 'src/shared/repository';

@Injectable()
export class OrganisationRepository
  extends Repository
  implements IOrganisationRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    data: ICreateOrganisationData,
    dbOptions?: IDbOptions,
  ): Promise<Organisation> {
    const pgDoc = await this.getClient(dbOptions).organisation.create({ data });
    return new Organisation({ pgDoc });
  }

  async getByInn(
    inn: string,
    dbOptions?: IDbOptions,
  ): Promise<Organisation | null> {
    const pgDoc = await this.getClient(dbOptions).organisation.findFirst({
      where: { inn },
    });
    if (!pgDoc) return null;
    return new Organisation({ pgDoc });
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<Organisation, 'id' | 'inn'>>,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).organisation.update({
      where: {
        inn,
      },
      data,
    });
  }
}
