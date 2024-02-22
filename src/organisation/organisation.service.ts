import { firstValueFrom } from 'rxjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrganisationRepository } from './organisation.repository';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { Organisation } from './organisation.entity';
import {
  ORG_ALREADY_EXIST,
  USER_ALREADY_HAS_ORGANISATION,
} from '../messages.constant';
import { HttpService } from '@nestjs/axios';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../db/prisma.service';
import { User } from '../user/user.entity';

@Injectable()
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
    private httpService: HttpService,
    private userRepository: UserRepository,
    private prismaService: PrismaService,
  ) {}

  async create(data: ICreateOrganisationData, user: User): Promise<any> {
    if (user.organisationId)
      throw new BadRequestException(USER_ALREADY_HAS_ORGANISATION);

    const org = await this.getByInn(data.inn);
    if (org) throw new BadRequestException(ORG_ALREADY_EXIST);

    await this.prismaService.$transaction(async (trxn) => {
      const newOrg = await this.organisationRepository.create(data, { trxn });
      await this.userRepository.update(
        { organisationId: newOrg.id },
        user.phoneNumber,
        { trxn },
      );
    });
  }

  async getByInn(inn: string): Promise<Organisation | null> {
    return this.organisationRepository.getByInn(inn);
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<ICreateOrganisationData, 'inn'>>,
  ): Promise<void> {
    await this.organisationRepository.updateOrgData(inn, data);
  }

  async getOrgInfoFromDadata(inn: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
        { query: inn },
        {
          headers: {
            Authorization: 'Token 219b5b35192ee1670d12e44fb5b807525b224d28',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ),
    );
    const orgInfo = data.suggestions[0];

    return new Organisation({ apiDoc: orgInfo });
  }
}
