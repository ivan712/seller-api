import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  validate(
    req: Request,
    { phoneNumber }: { phoneNumber: string },
  ): { phoneNumber: string; refreshToken: string } {
    const refreshToken = req.get('Authorization').split(' ')[1].trim();
    return { phoneNumber, refreshToken };
  }
}
