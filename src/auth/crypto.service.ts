import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class CryptoService {
  private minRandomValue;
  private maxRandomValue;
  private saltLength;
  private randomStringLength;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.minRandomValue = Number(this.configService.get('MIN_RANDOM_VALUE'));
    this.maxRandomValue = Number(this.configService.get('MAX_RANDOM_VALUE'));
    this.saltLength = Number(this.configService.get('SALT_LENGTH'));
    this.randomStringLength = Number(
      this.configService.get('RANDOM_STRING_LENGTH'),
    );
  }

  async validateData(data: string, dataHash: string): Promise<Boolean> {
    return compare(data, dataHash);
  }

  async generateRandomInt(): Promise<Number> {
    return new Promise((res, error) => {
      crypto.randomInt(
        this.minRandomValue,
        this.maxRandomValue + 1,
        (err, n) => {
          if (err) error(err);
          res(n);
        },
      );
    });
  }

  async createDataHash(data: string): Promise<string> {
    const salt = await genSalt(this.saltLength);
    return hash(data, salt);
  }

  async generateRandomString(): Promise<string> {
    const randomStringLength = this.randomStringLength;
    return new Promise((res, error) => {
      crypto.randomBytes(randomStringLength, function (err, buffer) {
        if (err) error(err);
        const randomStr = buffer.toString('hex').slice(0, randomStringLength);
        res(randomStr);
      });
    });
  }
}
