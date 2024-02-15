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
import { USER_ALREADY_EXIST } from '../messages.constant';
import { DataType, ValidationData } from './validation-data';

describe('UserService', () => {
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
                case 'ACCESS_TOKEN_EXPIRES_AT':
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
  });

  describe('preregister', () => {
    it('user does not exist - should be without any error', async () => {
      jest
        .spyOn(authService, 'upsertValidationCode')
        .mockImplementation(() => undefined);
      userService.getByPhone.mockReturnValueOnce(Promise.resolve(null));
      expect(
        await authService.preregister({ phoneNumber: '' }),
      ).toBeUndefined();
    });

    it('user exists - should be without any error', async () => {
      jest
        .spyOn(authService, 'upsertValidationCode')
        .mockImplementation(() => undefined);
      userService.getByPhone.mockReturnValueOnce(Promise.resolve({} as User));
      expect(authService.preregister({ phoneNumber: '' })).rejects.toThrow(
        USER_ALREADY_EXIST,
      );
    });
  });

  describe('upsertValidationCode', () => {
    it('check validation code', async () => {
      jest.useFakeTimers().setSystemTime(new Date('1970-01-01'));
      cryptoService.generateRandomInt.mockReturnValueOnce(Promise.resolve(123));
      cryptoService.createDataHash.mockImplementationOnce((x) =>
        Promise.resolve(x),
      );
      validationDataRepository.upsertData.mockImplementationOnce((x) =>
        Promise.resolve(x as unknown as void),
      );

      expect(await authService.upsertValidationCode('321')).toMatchObject(
        new ValidationData({
          data: '0123',
          expiredAt: new Date(envVars.verificationCodeExpireAt * 1000),
          phoneNumber: '321',
          dataType: DataType.validationCode,
        }),
      );
    });
  });
});
