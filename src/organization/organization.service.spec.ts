import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { ICreateOrganizationData } from './interfaces/create-organization.interface';
import { User } from '../user/user.entity';
import { OrganizationRepository } from './organization.repository';
import { Organization } from './organization.entity';
import {
  ORG_ALREADY_EXIST,
  ORG_NOT_FOUND,
  USER_ALREADY_HAS_ORGANIZATION,
} from '../messages.constant';

describe('OrganizationService', () => {
  let organizationService: OrganizationService;
  let organizationRepository: DeepMocked<OrganizationRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService],
    })
      .useMocker(createMock)
      .compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
    organizationRepository = module.get(OrganizationRepository);
  });

  describe('create', () => {
    it('success', async () => {
      const data = {
        inn: '1234567890',
      } as ICreateOrganizationData;

      const user = {
        id: 'user-id',
      } as User;

      const spyMock = jest
        .spyOn(organizationService, 'getByInn')
        .mockImplementation(() => null);
      organizationRepository.create.mockResolvedValueOnce({
        id: 'org-id',
      } as Organization);

      expect(await organizationService.create(data, user)).toBeUndefined();
      expect(spyMock).toHaveBeenCalledWith(data.inn);
    });

    it('user already has an organization', async () => {
      const user = {
        organizationId: 'org-id',
      } as User;

      const data = {
        inn: '1234567890',
      } as ICreateOrganizationData;

      expect(organizationService.create(data, user)).rejects.toThrow(
        USER_ALREADY_HAS_ORGANIZATION,
      );
    });

    it('organization already exists', async () => {
      const user = {
        id: 'user-id',
      } as User;

      const data = {
        inn: '1234567890',
      } as ICreateOrganizationData;

      const spyMock = jest
        .spyOn(organizationService, 'getByInn')
        .mockImplementation(
          () => Promise.resolve(data) as unknown as Promise<Organization>,
        );

      expect(organizationService.create(data, user)).rejects.toThrow(
        ORG_ALREADY_EXIST,
      );
      expect(spyMock).toHaveBeenCalledWith(data.inn);
    });
  });

  describe('get by inn', () => {
    it('success', async () => {
      const inn = '1234567890';
      const spyMock = jest
        .spyOn(organizationService, 'getByInn')
        .mockImplementation(
          (inn) => Promise.resolve({ inn }) as unknown as Promise<Organization>,
        );

      expect(await organizationService.getByInn(inn)).toMatchObject({ inn });
      expect(spyMock).toHaveBeenCalledWith(inn);
    });
  });

  describe('update org data', () => {
    const inn = '1234567890';
    const data = {
      name: 'Romashka',
    };

    it('success', async () => {
      const spyMockGetByInn = jest
        .spyOn(organizationRepository, 'getByOrgId')
        .mockImplementation(
          (inn) => Promise.resolve({ inn }) as unknown as Promise<Organization>,
        );

      const spyMockUpdateOrgData = jest.spyOn(
        organizationRepository,
        'updateOrgData',
      );

      expect(
        await organizationService.updateOrgData(inn, data),
      ).toBeUndefined();
      expect(spyMockGetByInn).toHaveBeenCalledWith(inn);
      expect(spyMockUpdateOrgData).toHaveBeenCalledWith(inn, data);
    });

    it('organization not found', async () => {
      const spyMockUpdateOrgData = jest.spyOn(
        organizationRepository,
        'updateOrgData',
      );

      organizationRepository.getByOrgId.mockResolvedValueOnce(null);

      expect(organizationService.updateOrgData(inn, data)).rejects.toThrow(
        ORG_NOT_FOUND,
      );
      expect(spyMockUpdateOrgData).not.toHaveBeenCalled();
    });
  });

  describe('get org info from dadata', () => {
    const inn = '123';
    it('success', async () => {
      organizationRepository.getOrgInfoFromDadata.mockImplementationOnce(
        (inn) => Promise.resolve({ inn } as Organization),
      );

      expect(await organizationService.getOrgInfoFromDadata(inn)).toMatchObject(
        { inn },
      );
    });
  });
});
