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

@Injectable()
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
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
}
