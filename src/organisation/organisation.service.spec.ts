import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationService } from './organisation.service';
import { ICreateOrganisationData } from './interfaces/create-organisation.interface';
import { User } from '../user/user.entity';
import { OrganisationRepository } from './organisation.repository';
import { Organisation } from './organisation.entity';
import {
  ORG_ALREADY_EXIST,
  ORG_NOT_FOUND,
  USER_ALREADY_HAS_ORGANISATION,
} from '../messages.constant';

describe('OrganisationService', () => {
  let organisationService: OrganisationService;
  let organisationRepository: DeepMocked<OrganisationRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationService],
    })
      .useMocker(createMock)
      .compile();

    organisationService = module.get<OrganisationService>(OrganisationService);
    organisationRepository = module.get(OrganisationRepository);
  });

  describe('create', () => {
    it('success', async () => {
      const data = {
        inn: '1234567890',
      } as ICreateOrganisationData;

      const user = {
        id: 'user-id',
      } as User;

      const spyMock = jest
        .spyOn(organisationService, 'getByInn')
        .mockImplementation(() => null);
      organisationRepository.create.mockResolvedValueOnce({
        id: 'org-id',
      } as Organisation);

      expect(await organisationService.create(data, user)).toBeUndefined();
      expect(spyMock).toHaveBeenCalledWith(data.inn);
    });

    it('user already has an ogranisation', async () => {
      const user = {
        organisationId: 'org-id',
      } as User;

      const data = {
        inn: '1234567890',
      } as ICreateOrganisationData;

      expect(organisationService.create(data, user)).rejects.toThrow(
        USER_ALREADY_HAS_ORGANISATION,
      );
    });

    it('organisation already exists', async () => {
      const user = {
        id: 'user-id',
      } as User;

      const data = {
        inn: '1234567890',
      } as ICreateOrganisationData;

      const spyMock = jest
        .spyOn(organisationService, 'getByInn')
        .mockImplementation(
          () => Promise.resolve(data) as unknown as Promise<Organisation>,
        );

      expect(organisationService.create(data, user)).rejects.toThrow(
        ORG_ALREADY_EXIST,
      );
      expect(spyMock).toHaveBeenCalledWith(data.inn);
    });
  });

  describe('get by inn', () => {
    it('success', async () => {
      const inn = '1234567890';
      const spyMock = jest
        .spyOn(organisationService, 'getByInn')
        .mockImplementation(
          (inn) => Promise.resolve({ inn }) as unknown as Promise<Organisation>,
        );

      expect(await organisationService.getByInn(inn)).toMatchObject({ inn });
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
        .spyOn(organisationService, 'getByInn')
        .mockImplementation(
          (inn) => Promise.resolve({ inn }) as unknown as Promise<Organisation>,
        );

      const spyMockUpdateOrgData = jest.spyOn(
        organisationRepository,
        'updateOrgData',
      );

      expect(
        await organisationService.updateOrgData(inn, data),
      ).toBeUndefined();
      expect(spyMockGetByInn).toHaveBeenCalledWith(inn);
      expect(spyMockUpdateOrgData).toHaveBeenCalledWith(inn, data);
    });

    it('organisation not found', async () => {
      const spyMockGetByInn = jest
        .spyOn(organisationService, 'getByInn')
        .mockImplementation(() => null);

      const spyMockUpdateOrgData = jest.spyOn(
        organisationRepository,
        'updateOrgData',
      );

      expect(organisationService.updateOrgData(inn, data)).rejects.toThrow(
        ORG_NOT_FOUND,
      );
      expect(spyMockGetByInn).toHaveBeenCalledWith(inn);
      expect(spyMockUpdateOrgData).not.toHaveBeenCalled();
    });
  });

  describe('get org info from dadata', () => {
    const inn = '123';
    it('success', async () => {
      organisationRepository.getOrgInfoFromDadata.mockImplementationOnce(
        (inn) => Promise.resolve({ inn } as Organisation),
      );

      expect(await organisationService.getOrgInfoFromDadata(inn)).toMatchObject(
        { inn },
      );
    });
  });
});
