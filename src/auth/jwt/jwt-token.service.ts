import { JwtService } from '@nestjs/jwt';
import { IPayloadData } from '../interfaces/payload-data.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../crypto.service';

@Injectable()
export class JwtTokensService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(CryptoService) private cryptoService: CryptoService,
  ) {}

  async generateAccessJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('ACCESS_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async generateUpdateDataJwt(
    payloadData: IPayloadData,
  ): Promise<{ updateJwt: string; jwtid: string }> {
    const jwtid = await this.cryptoService.generateRandomString();
    const updateJwt = await this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('DATA_UPDATE_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_UPDATE_DATA_SECRET'),
      jwtid,
    });

    return {
      updateJwt,
      jwtid,
    };
  }

  async generateRefreshJwt(
    payloadData: IPayloadData,
  ): Promise<{ refreshJwt: string; jwtid: string }> {
    const jwtid = await this.cryptoService.generateRandomString();
    const refreshJwt = await this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('REFRESH_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      jwtid,
    });
    return { refreshJwt, jwtid };
  }
}
