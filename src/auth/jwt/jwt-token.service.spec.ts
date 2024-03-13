import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { JwtTokensService } from './jwt-token.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto.service';

describe('JwtTokenService', () => {
  let jwtTokensService: JwtTokensService;
  let jwtService: JwtService;
  let cryptoService: DeepMocked<CryptoService>;

  const envVars = {
    accessTokenExpiresAt: 1002,
    dataUpdateTokenExpiresAt: 300,
    refreshTokenExpiresAt: 303,
    jwtAccessSecret: 'access_secret',
    jwtUpdateDataSecret: 'update_data_secret',
    jwtRefreshSecret: 'refresh_secret',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokensService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (varName) => {
              switch (varName) {
                case 'ACCESS_TOKEN_EXPIRES_AT':
                  return envVars.accessTokenExpiresAt;
                case 'DATA_UPDATE_TOKEN_EXPIRES_AT':
                  return envVars.dataUpdateTokenExpiresAt;
                case 'REFRESH_TOKEN_EXPIRES_AT':
                  return envVars.refreshTokenExpiresAt;
                case 'JWT_ACCESS_SECRET':
                  return envVars.jwtAccessSecret;
                case 'JWT_UPDATE_DATA_SECRET':
                  return envVars.jwtUpdateDataSecret;
                case 'JWT_REFRESH_SECRET':
                  return envVars.jwtRefreshSecret;
              }
            },
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    jwtService = module.get<JwtService>(JwtService);
    jwtTokensService = module.get<JwtTokensService>(JwtTokensService);
    cryptoService = module.get(CryptoService);

    cryptoService.generateRandomString.mockResolvedValue('123321');
  });

  it('access token', async () => {
    const userId = '123321';

    const accessToken = await jwtTokensService.generateAccessJwt({
      userId,
    });

    const verify = await jwtService.verifyAsync(accessToken, {
      secret: envVars.jwtAccessSecret,
    });

    expect(verify.userId).toBe(userId);
    expect(verify.exp - verify.iat).toBe(envVars.accessTokenExpiresAt);
    expect(
      jwtService.verifyAsync(accessToken, {
        secret: envVars.jwtAccessSecret + '123',
      }),
    ).rejects.toThrow('invalid signature');
  });

  it('update token', async () => {
    const phoneNumber = '79856829428';

    const { updateJwt, jwtid } = await jwtTokensService.generateUpdateDataJwt({
      userContact: phoneNumber,
    });

    const verify = await jwtService.verifyAsync(updateJwt, {
      secret: envVars.jwtUpdateDataSecret,
    });

    expect(verify.userContact).toBe(phoneNumber);
    expect(verify.jti).toBe(jwtid);
    expect(verify.exp - verify.iat).toBe(envVars.dataUpdateTokenExpiresAt);
    expect(
      jwtService.verifyAsync(updateJwt, {
        secret: envVars.jwtUpdateDataSecret + '123',
      }),
    ).rejects.toThrow('invalid signature');
  });

  it('refresh token', async () => {
    const userId = 'userId';

    const { refreshJwt, jwtid } = await jwtTokensService.generateRefreshJwt({
      userId,
    });

    const verify = await jwtService.verifyAsync(refreshJwt, {
      secret: envVars.jwtRefreshSecret,
    });

    expect(verify.userId).toBe(userId);
    expect(verify.jti).toBe(jwtid);
    expect(verify.exp - verify.iat).toBe(envVars.refreshTokenExpiresAt);
    expect(
      jwtService.verifyAsync(refreshJwt, {
        secret: envVars.jwtRefreshSecret + '123',
      }),
    ).rejects.toThrow('invalid signature');
  });
});
