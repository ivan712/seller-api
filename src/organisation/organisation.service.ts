import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganisationRepository } from './organisation.repository';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { OrgStatus, Organisation } from './organisation.entity';
import {
  ORG_ALREADY_EXIST,
  ORG_NOT_FOUND,
  USER_ALREADY_HAS_ORGANISATION,
} from '../messages.constant';
import { User } from '../user/user.entity';
import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { bitrixCreateOrgResponseSudscriberConfig } from '../rabbit/config';

@Injectable()
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
  ) {}

  async create(data: ICreateOrganisationData, user: User): Promise<void> {
    if (user.organisationId)
      throw new BadRequestException(USER_ALREADY_HAS_ORGANISATION);

    const org = await this.getByInn(data.inn);
    if (org) throw new BadRequestException(ORG_ALREADY_EXIST);

    await this.organisationRepository.create(data);
  }

  async getByInn(inn: string): Promise<Organisation | null> {
    return this.organisationRepository.getByInn(inn);
  }

  async updateOrgData(
    inn: string,
    data: Partial<Omit<ICreateOrganisationData, 'inn'>>,
  ): Promise<void> {
    const org = await this.getByInn(inn);
    if (!org) throw new NotFoundException(ORG_NOT_FOUND);
    await this.organisationRepository.updateOrgData(inn, data);
  }

  async getOrgInfoFromDadata(inn: string): Promise<Organisation> {
    return this.organisationRepository.getOrgInfoFromDadata(inn);
  }

  @RabbitSubscribe({
    ...bitrixCreateOrgResponseSudscriberConfig,
    errorHandler: defaultNackErrorHandler,
  })
  public async handleBitrixCreateOrgResponseMessage(message: { inn: string }) {
    await this.updateOrgData(message.inn, {
      status: OrgStatus.ON_MODERATION,
    });
  }
}
