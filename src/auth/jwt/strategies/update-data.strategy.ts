import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class UpdateTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-update-data',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: false,
      secretOrKey: configService.get('JWT_UPDATE_DATA_SECRET'),
    });
  }

  validate(
    req: Request,
    { phoneNumber, jti }: { phoneNumber: string; jti: string },
  ): { phoneNumber: string; jti: string } {
    return { phoneNumber, jti };
  }
}
