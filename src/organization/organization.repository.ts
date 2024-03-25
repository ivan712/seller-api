import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ICreateOrganizationData } from './interfaces/create-organization.interface';
import { IOrganizationRepository } from './interfaces/organization-repository.interface';
import { Organization } from './organization.entity';
import { IDbOptions } from '../db/db-options.interface';
import { Repository } from '../db/repository';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrganizationRepository
  extends Repository
  implements IOrganizationRepository
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
    data: ICreateOrganizationData,
    dbOptions?: IDbOptions,
  ): Promise<Organization> {
    const pgDoc = await this.getClient(dbOptions).organization.create({ data });
    return new Organization({ pgDoc });
  }

  async getByInn(
    inn: string,
    dbOptions?: IDbOptions,
  ): Promise<Organization | null> {
    const pgDoc = await this.getClient(dbOptions).organization.findFirst({
      where: { inn },
    });
    if (!pgDoc) return null;
    return new Organization({ pgDoc });
  }

  async getByUserId(
    id: string,
    dbOptions?: IDbOptions,
  ): Promise<Organization | null> {
    const pgDoc = await this.getClient(dbOptions).user.findUnique({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    });

    const org = pgDoc.organization;

    if (!org) return null;

    return new Organization({ pgDoc: pgDoc.organization });
  }

  async getOrgInfoFromDadata(inn: string): Promise<Organization> {
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

    return new Organization({ apiDoc: orgInfo });
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<Organization, 'id' | 'inn'>>,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).organization.update({
      where: {
        inn,
      },
      data,
    });
  }
}
