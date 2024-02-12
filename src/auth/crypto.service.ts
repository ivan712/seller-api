import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class CryptoService {
  private minRandomValue;
  private maxRandomValue;
  private saltLength;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.minRandomValue = Number(
      this.configService.get<Number>('MIN_RANDOM_VALUE'),
    );
    this.maxRandomValue = Number(
      this.configService.get<Number>('MAX_RANDOM_VALUE'),
    );
    this.saltLength = Number(this.configService.get<Number>('SALT_LENGTH'));
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
}
