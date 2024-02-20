import { Inject, Injectable } from '@nestjs/common';
import { OrganisationRepository } from './organisation.repository';
import { IOrganisationRepository } from './interfaces/organisation-repository.interface';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { Organisation } from './organisation.entity';

@Injectable()
export class OrganisationService {
  constructor(
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
  ) {}

  async create(data: ICreateOrganisationData): Promise<void> {
    await this.organisationRepository.create(data);
  }

  async getByInn(inn: string): Promise<Organisation | null> {
    return this.organisationRepository.getByInn(inn);
  }

  async confirmRegistration(inn: string): Promise<void> {
    await this.organisationRepository.confirmRegistration(inn);
  }
}
