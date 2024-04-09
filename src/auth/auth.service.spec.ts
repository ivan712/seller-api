import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { ValidationDataRepository } from './repositories/validation-data.repository';
import { UserService } from '../user/user.service';
import { JwtTokensService } from './jwt/jwt-token.service';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import {
  INCORRECT_USER_NAME_OR_PASSWORD,
  INCORRECT_USER_NAME_OR_VALIDATION_CODE,
  INVALID_TOKEN,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from '../messages.constant';
import { DataType, ValidationData } from './validation-data.entity';
import { ICreateUser } from '../user/interfaces/create-user.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let refreshTokenRepository: DeepMocked<RefreshTokenRepository>;
  let validationDataRepository: DeepMocked<ValidationDataRepository>;
  let userService: DeepMocked<UserService>;
  let jwtTokensService: DeepMocked<JwtTokensService>;
  let cryptoService: DeepMocked<CryptoService>;

  const envVars = {
    verificationCodeLength: 4,
    verificationCodeExpireAt: 1000,
    passwordUpdateTokenExpireAt: 123,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: (varName) => {
              switch (varName) {
                case 'VERIFICATION_CODE_LENGTH':
                  return envVars.verificationCodeLength;
                case 'VERIFICATION_CODE_EXPIRES_AT':
                  return envVars.verificationCodeExpireAt;
                case 'DATA_UPDATE_TOKEN_EXPIRES_AT':
                  return envVars.passwordUpdateTokenExpireAt;
              }
            },
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    refreshTokenRepository = module.get(RefreshTokenRepository);
    validationDataRepository = module.get(ValidationDataRepository);
    cryptoService = module.get(CryptoService);
    userService = module.get(UserService);
    jwtTokensService = module.get(JwtTokensService);
  });

  describe('preregister', () => {
    it('success', async () => {
      const phoneNumber = '71234';

      const spyMock = jest
        .spyOn(authService, 'upsertValidationCode')
        .mockResolvedValue(undefined);
      userService.getByPhone.mockResolvedValueOnce(null);

      expect(await authService.preregister({ phoneNumber })).toBeUndefined();
      expect(spyMock).toHaveBeenCalledWith(phoneNumber);
    });

    it('user exists - should be without any error', async () => {
      const spyMock = jest
        .spyOn(authService, 'upsertValidationCode')
        .mockResolvedValueOnce(undefined);
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: '123',
      } as User);

      expect(authService.preregister({ phoneNumber: '' })).rejects.toThrow(
        USER_ALREADY_EXIST,
      );
      expect(spyMock).not.toHaveBeenCalled();
    });
  });

  describe('upsertValidationCode', () => {
    it('check validation code 1', async () => {
      const phoneNumber = '7891';
      const code = 123;

      jest.useFakeTimers().setSystemTime(new Date('1970-01-01'));
      cryptoService.generateRandomInt.mockResolvedValueOnce(code);
      cryptoService.createDataHash.mockImplementationOnce((x) =>
        Promise.resolve(x),
      );
      validationDataRepository.upsertData.mockResolvedValueOnce(undefined);

      expect(
        await authService.upsertValidationCode(phoneNumber),
      ).toBeUndefined();
      expect(validationDataRepository.upsertData).toHaveBeenCalledWith(
        new ValidationData({
          data: '0' + String(code),
          expiredAt: new Date(envVars.verificationCodeExpireAt * 1000),
          userContact: phoneNumber,
          dataType: DataType.validationCode,
        }),
      );

      envVars.passwordUpdateTokenExpireAt = 2000;
      envVars.verificationCodeExpireAt = 200;
      envVars.verificationCodeLength = 6;
    });

    it('check validation code 2', async () => {
      const phoneNumber = '3210';
      const code = 567;
      jest.useFakeTimers().setSystemTime(new Date('1970-01-01'));
      cryptoService.generateRandomInt.mockResolvedValueOnce(code);
      cryptoService.createDataHash.mockImplementationOnce((x) =>
        Promise.resolve(x),
      );
      validationDataRepository.upsertData.mockResolvedValueOnce(undefined);

      expect(
        await authService.upsertValidationCode(phoneNumber),
      ).toBeUndefined();
      expect(validationDataRepository.upsertData).toHaveBeenCalledWith(
        new ValidationData({
          data: '000' + String(code),
          expiredAt: new Date(envVars.verificationCodeExpireAt * 1000),
          userContact: phoneNumber,
          dataType: DataType.validationCode,
        }),
      );
    });
  });

  describe('generatePasswordUpdateToken', () => {
    const phoneNumber = '321';
    const validationCode = new ValidationData({
      data: '0123',
      expiredAt: new Date(0),
      userContact: phoneNumber,
      dataType: DataType.validationCode,
    });

    it('non-existent validation code', async () => {
      validationDataRepository.get.mockResolvedValueOnce(null);

      expect(
        authService.generatePasswordUpdateToken(phoneNumber, ''),
      ).rejects.toThrow(INCORRECT_USER_NAME_OR_VALIDATION_CODE);
    });

    it('expired validation code', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2000-01-01'));
      validationDataRepository.get.mockResolvedValueOnce(validationCode);

      expect(
        authService.generatePasswordUpdateToken(phoneNumber, ''),
      ).rejects.toThrow(INCORRECT_USER_NAME_OR_VALIDATION_CODE);
    });

    it('invalid validation code', async () => {
      jest.useFakeTimers().setSystemTime(new Date('1970-01-01'));

      validationDataRepository.get.mockResolvedValueOnce(validationCode);

      cryptoService.validateData.mockResolvedValueOnce(false);
      expect(
        authService.generatePasswordUpdateToken(phoneNumber, ''),
      ).rejects.toThrow(INCORRECT_USER_NAME_OR_VALIDATION_CODE);
    });

    it('success', async () => {
      const updateToken = {
        updateJwt: 'updateJwt',
        jwtid: 'id',
      };
      const phoneNumber = '123321';
      const code = '999';

      validationDataRepository.get.mockResolvedValueOnce(validationCode);
      cryptoService.validateData.mockResolvedValueOnce(true);
      jwtTokensService.generateUpdateDataJwt.mockResolvedValueOnce(updateToken);
      validationDataRepository.deleteOne.mockResolvedValueOnce(undefined);

      expect(
        await authService.generatePasswordUpdateToken(code, phoneNumber),
      ).toMatchObject({
        updateToken: updateToken.updateJwt,
      });
      expect(validationDataRepository.upsertData).toHaveBeenCalledWith(
        new ValidationData({
          data: updateToken.jwtid,
          expiredAt: new Date(envVars.passwordUpdateTokenExpireAt * 1000),
          userContact: phoneNumber,
          dataType: DataType.passwordUpdateToken,
        }),
      );
    });
  });

  describe('passwordResetRequest', () => {
    it('user does not exist', async () => {
      jest
        .spyOn(authService, 'upsertValidationCode')
        .mockImplementation(() => undefined);
      userService.getByPhone.mockResolvedValueOnce(null);
      expect(authService.passwordResetRequest('')).rejects.toThrow(
        USER_NOT_FOUND,
      );
    });

    it('user exists', async () => {
      const phoneNumber = '12354';
      const spyMock = jest
        .spyOn(authService, 'upsertValidationCode')
        .mockImplementation(() => undefined);
      userService.getByPhone.mockResolvedValueOnce({} as User);

      expect(
        await authService.passwordResetRequest(phoneNumber),
      ).toBeUndefined();
      expect(spyMock).toHaveBeenCalledWith(phoneNumber);
    });
  });

  describe('passwordResetConfirm', () => {
    it('user does not exist', async () => {
      jest
        .spyOn(authService, 'upsertValidationCode')
        .mockImplementation(() => undefined);
      userService.getByPhone.mockResolvedValueOnce(null);
      expect(authService.passwordResetConfirm('', '')).rejects.toThrow(
        INCORRECT_USER_NAME_OR_VALIDATION_CODE,
      );
    });

    it('success', async () => {
      const phoneNumber = '333';
      const code = '444';
      const updateToken = {
        updateToken: 'token',
      };

      const spyMock = jest
        .spyOn(authService, 'generatePasswordUpdateToken')
        .mockResolvedValue({
          updateToken: 'token',
        });
      userService.getByPhone.mockResolvedValueOnce({} as User);

      expect(
        await authService.passwordResetConfirm(phoneNumber, code),
      ).toMatchObject(updateToken);
      expect(spyMock).toHaveBeenCalledWith(code, phoneNumber);
    });
  });

  describe('register', () => {
    it('user alredy exists', async () => {
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: '123 ',
      } as User);
      expect(authService.register({} as ICreateUser, '')).rejects.toThrow(
        USER_ALREADY_EXIST,
      );
      expect(userService.create).not.toHaveBeenCalled();
    });

    it('success', async () => {
      const updateToken = {
        updateToken: 'token',
      };
      jest
        .spyOn(authService, 'generatePasswordUpdateToken')
        .mockResolvedValueOnce({
          updateToken: 'token',
        }),
        userService.getByPhone.mockResolvedValueOnce(null);
      expect(await authService.register({} as ICreateUser, '')).toMatchObject(
        updateToken,
      );
      expect(userService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('user does not exist', async () => {
      userService.getByPhone.mockResolvedValueOnce(null);
      expect(authService.login('', '')).rejects.toThrow(
        INCORRECT_USER_NAME_OR_PASSWORD,
      );
    });

    it('user has not set password yet', async () => {
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: null,
      } as User);
      expect(authService.login('', '')).rejects.toThrow(
        INCORRECT_USER_NAME_OR_PASSWORD,
      );
    });

    it('invalid password', async () => {
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: 'hash',
      } as User);
      cryptoService.validateData.mockResolvedValueOnce(false);
      expect(authService.login('', '')).rejects.toThrow(
        INCORRECT_USER_NAME_OR_PASSWORD,
      );
    });

    it('success', async () => {
      const accessToken = 'accessToken';
      const refreshToken = {
        refreshJwt: 'refreshJwt',
        jwtid: 'jwtid',
      };
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: 'hash',
      } as User);
      cryptoService.validateData.mockResolvedValueOnce(true);
      refreshTokenRepository.count.mockResolvedValueOnce(4);
      jwtTokensService.generateAccessAndRefreshJwt.mockResolvedValueOnce({
        accessToken,
        refreshToken,
      });
      refreshTokenRepository.add.mockResolvedValueOnce(null);
      expect(await authService.login('', '')).toMatchObject({
        accessToken,
        refreshToken: refreshToken.refreshJwt,
      });
      expect(refreshTokenRepository.add).toHaveBeenCalled();
      expect(refreshTokenRepository.deleteAll).not.toHaveBeenCalled();
    });

    it('the user has more than allowed refresh tokens', async () => {
      const accessToken = 'accessToken';
      const refreshToken = {
        refreshJwt: 'refreshJwt',
        jwtid: 'jwtid',
      };
      userService.getByPhone.mockResolvedValueOnce({
        passwordHash: 'hash',
      } as User);
      cryptoService.validateData.mockResolvedValueOnce(true);
      refreshTokenRepository.count.mockResolvedValueOnce(7);
      jwtTokensService.generateAccessAndRefreshJwt.mockResolvedValueOnce({
        accessToken,
        refreshToken,
      });

      expect(await authService.login('', '')).toMatchObject({
        accessToken,
        refreshToken: refreshToken.refreshJwt,
      });
      expect(refreshTokenRepository.add).toHaveBeenCalled();
      expect(refreshTokenRepository.deleteAll).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('token session does not exist', async () => {
      validationDataRepository.get.mockResolvedValueOnce(null);
      expect(authService.updatePassword('', '', '')).rejects.toThrow(
        INVALID_TOKEN,
      );
    });

    it('token session is not valid', async () => {
      validationDataRepository.get.mockResolvedValueOnce({
        getData: () => '123',
      } as ValidationData);
      expect(authService.updatePassword('', '', '1234')).rejects.toThrow(
        INVALID_TOKEN,
      );
    });

    it('success', async () => {
      const accessToken = 'token';
      const refreshToken = {
        refreshJwt: 'refreshTokent',
        jwtid: 'jwtid-token',
      };
      const userId = 'user-uid';

      const phoneNumber = '444';
      const password = '888';
      const passwordHash = 'hash';
      refreshTokenRepository.count.mockResolvedValueOnce(1);
      validationDataRepository.get.mockResolvedValueOnce({
        getData: () => '123',
        getUserContact: () => phoneNumber,
      } as ValidationData);
      cryptoService.createDataHash.mockResolvedValueOnce(passwordHash);
      userService.setPassword.mockResolvedValueOnce(undefined);
      userService.getByPhone.mockResolvedValueOnce({ id: userId } as User);
      jwtTokensService.generateAccessAndRefreshJwt.mockResolvedValueOnce({
        accessToken,
        refreshToken,
      });

      expect(
        await authService.updatePassword(password, phoneNumber, '123'),
      ).toMatchObject({ accessToken, refreshToken: refreshToken.refreshJwt });
      expect(validationDataRepository.deleteOne).toHaveBeenCalledWith(
        phoneNumber,
        DataType.passwordUpdateToken,
      );
      expect(cryptoService.createDataHash).toHaveBeenCalledWith(password);
      expect(userService.setPassword).toHaveBeenCalledWith(
        passwordHash,
        userId,
      );
    });

    describe('refresh', () => {
      it('token session does not exist', async () => {
        refreshTokenRepository.getOne.mockResolvedValueOnce(null);
        expect(authService.refresh('', '')).rejects.toThrow(INVALID_TOKEN);
      });

      it('success', async () => {
        const accessToken = 'accessToken';
        const refreshToken = {
          refreshJwt: 'refreshJwt',
          jwtid: 'jwtid',
        };
        const tokenId = 'tokenId';
        refreshTokenRepository.getOne.mockResolvedValueOnce(tokenId);
        jwtTokensService.generateAccessAndRefreshJwt.mockResolvedValueOnce({
          accessToken,
          refreshToken,
        });
        expect(await authService.refresh('', tokenId)).toMatchObject({
          accessToken,
          refreshToken: refreshToken.refreshJwt,
        });
        expect(refreshTokenRepository.update).toHaveBeenCalledWith(
          tokenId,
          refreshToken.jwtid,
        );
      });
    });

    describe('logout', () => {
      it('refresh session does not exist', async () => {
        refreshTokenRepository.getOne.mockResolvedValueOnce(null);
        expect(authService.logout('')).rejects.toThrow(INVALID_TOKEN);
      });

      it('success', async () => {
        const tokenId = 'tokenId';
        refreshTokenRepository.getOne.mockResolvedValueOnce(tokenId);
        expect(await authService.logout(tokenId)).toBeUndefined();
        expect(refreshTokenRepository.deleteOne).toHaveBeenCalledWith(tokenId);
      });
    });
  });
});
