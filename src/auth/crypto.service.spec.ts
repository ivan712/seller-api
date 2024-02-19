import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  const envVars = {
    minRandomValue: 0,
    maxRandomValue: 10,
    saltLength: 5,
    randomStringLength: 10,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: {
            get: (varName) => {
              switch (varName) {
                case 'MIN_RANDOM_VALUE':
                  return envVars.minRandomValue;
                case 'MAX_RANDOM_VALUE':
                  return envVars.maxRandomValue;
                case 'SALT_LENGTH':
                  return envVars.saltLength;
                case 'RANDOM_STRING_LENGTH':
                  return envVars.randomStringLength;
              }
            },
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    cryptoService = module.get<CryptoService>(CryptoService);
  });

  it('generateRandomInt', async () => {
    const randomNumbers = [];
    for (let i = 0; i < 10; i++) {
      const number = await cryptoService.generateRandomInt();
      randomNumbers.push(number);
    }

    for (const i of randomNumbers) {
      expect(i).toBeLessThanOrEqual(10);
      expect(i).toBeGreaterThanOrEqual(0);
    }
  });

  it('createDataHash and validateData', async () => {
    const secretData = 'secret_data';
    const dataHash = await cryptoService.createDataHash(secretData);
    const isDataValid = await cryptoService.validateData(secretData, dataHash);
    const invalidData = await cryptoService.validateData(
      'invalid_data',
      dataHash,
    );
    const invalidHash = await cryptoService.validateData(
      secretData,
      'invalid_hash',
    );

    expect(isDataValid).toBeTruthy();
    expect(invalidData).toBeFalsy();
    expect(invalidHash).toBeFalsy();
  });

  it('generate random string', async () => {
    const str1 = await cryptoService.generateRandomString();
    const str2 = await cryptoService.generateRandomString();

    expect(str1.length).toBe(envVars.randomStringLength);
    expect(str2.length).toBe(envVars.randomStringLength);
    expect(str1).not.toBe(str2);
  });
});
