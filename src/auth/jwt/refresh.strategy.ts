import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate({ phoneNumber }: Pick<LoginDto, 'phoneNumber'>) {
    return { phoneNumber };
  }
}
