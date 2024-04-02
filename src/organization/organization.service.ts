import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { IOrganizationRepository } from './interfaces/organization-repository.interface';
import { ICreateOrganizationData } from './interfaces/create-organization.interface';
import { Organization } from './organization.entity';
import {
  ORG_ALREADY_EXIST,
  ORG_NOT_FOUND,
  USER_ALREADY_HAS_ORGANIZATION,
} from '../messages.constant';
import { User } from '../user/user.entity';
import { PrismaService } from '../db/prisma.service';
import { UserRepository } from '../user/user.repository';
import { IUserRepository } from '../user/interfaces/user-repository.interface';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(OrganizationRepository)
    private organizationRepository: IOrganizationRepository,
    @Inject(UserRepository) private userRepository: IUserRepository,
    private prismaService: PrismaService,
  ) {}

  async create(data: ICreateOrganizationData, user: User): Promise<void> {
    if (user.organizationId)
      throw new BadRequestException(USER_ALREADY_HAS_ORGANIZATION);

    const org = await this.getByInn(data.inn);
    if (org) throw new BadRequestException(ORG_ALREADY_EXIST);

    await this.prismaService.$transaction(async (trxn) => {
      const newOrg = await this.organizationRepository.create(data, { trxn });
      await this.userRepository.update({ organizationId: newOrg.id }, user.id, {
        trxn,
      });
    });
  }

  async getByInn(inn: string): Promise<Organization | null> {
    return this.organizationRepository.getByInn(inn);
  }

  async updateOrgData(
    id: string,
    data: Partial<Omit<ICreateOrganizationData, 'inn'>>,
  ): Promise<void> {
    const org = await this.organizationRepository.getByOrgId(id);
    if (!org) throw new NotFoundException(ORG_NOT_FOUND);
    await this.organizationRepository.updateOrgData(id, data);
  }

  async getOrgInfoFromDadata(inn: string): Promise<Organization> {
    return this.organizationRepository.getOrgInfoFromDadata(inn);
  }

  async getAll(): Promise<Organization[]> {
    return this.organizationRepository.getAll();
  }
}
