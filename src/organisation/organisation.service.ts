import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrganisationRepository } from './organisation.repository';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { Organisation } from './organisation.entity';
import {
  ORG_ALREADY_EXIST,
  USER_ALREADY_HAS_ORGANISATION,
} from '../messages.constant';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from '../db/prisma.service';
import { User } from '../user/user.entity';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
// import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrganisationService {
  private dadataUrl;
  private dadataToken;

  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
    private httpService: HttpService,
    private readonly amqpConnection: AmqpConnection,
    private userRepository: UserRepository,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.dadataUrl = this.configService.get('DADATA_URL');
    this.dadataToken = this.configService.get('DADATA_TOKEN');
  }

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

      const res = await this.amqpConnection.publish(
        'bitrix',
        'bitrix.key.create.org',
        newOrg,
        {
          replyTo: 'bitrix.queue.create.org.response',
        },
      );
      console.log('res', res);
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
}
