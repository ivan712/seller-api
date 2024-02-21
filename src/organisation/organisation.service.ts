import { firstValueFrom } from 'rxjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrganisationRepository } from './organisation.repository';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { Organisation } from './organisation.entity';
import { ORG_ALREADY_EXIST } from '../messages.constant';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
    private httpService: HttpService,
  ) {}

  async create(data: ICreateOrganisationData): Promise<any> {
    const org = await this.getByInn(data.inn);
    if (org) throw new BadRequestException(ORG_ALREADY_EXIST);
    return this.organisationRepository.create(data);
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

  async getOrgInfoFromThirdartyApi(inn: string): Promise<any> {
    console.log('inn', inn);
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
