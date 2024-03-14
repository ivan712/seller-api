import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { Organisation } from './organisation.entity';
import { IDbOptions } from '../shared/db-options.interface';
import { Repository } from '../shared/repository';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrganisationRepository
  extends Repository
  implements IOrganisationRepository
{
  private dadataUrl;
  private dadataToken;

  constructor(
    prisma: PrismaService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    super(prisma);
    this.dadataUrl = this.configService.get('DADATA_URL');
    this.dadataToken = this.configService.get('DADATA_TOKEN');
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

  async getByUserId(
    id: string,
    dbOptions?: IDbOptions,
  ): Promise<Organisation | null> {
    const pgDoc = await this.getClient(dbOptions).user.findUnique({
      where: {
        id,
      },
      include: {
        organisation: true,
      },
    });

    const org = pgDoc.organisation;

    if (!org) return null;

    return new Organisation({ pgDoc: pgDoc.organisation });
  }

  async getOrgInfoFromDadata(inn: string): Promise<Organisation> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        this.dadataUrl,
        { query: inn },
        {
          headers: {
            Authorization: this.dadataToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ),
    );
    const orgInfo = data.suggestions[0];

    return new Organisation({ apiDoc: orgInfo });
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
