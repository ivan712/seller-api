import { JwtService } from '@nestjs/jwt';
import { IPayloadData } from '../interfaces/payload-data.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../crypto.service';
import { IPayloadUpdateData } from '../interfaces/payload-update-data.interface';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

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
    payloadData: IPayloadUpdateData,
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

  async generateRefreshJwt(payloadData: IPayloadData): Promise<IRefreshToken> {
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

  async generateAccessAndRefreshJwt(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: IRefreshToken }> {
    const payload = { userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessJwt(payload),
      this.generateRefreshJwt(payload),
    ]);

    return { accessToken, refreshToken };
  }
}
