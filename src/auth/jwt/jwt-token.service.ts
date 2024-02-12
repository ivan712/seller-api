import { JwtService } from '@nestjs/jwt';
import { IPayloadData } from '../interfaces/payload-data.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokensService {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async generateAccessJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('ACCESS_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async generateUpdateDataJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('PASSWORD_UPDATE_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async generateRefreshJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('REFRESH_TOKEN_EXPIRES_AT'),
      ),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
