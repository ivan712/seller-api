import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginDto } from '../dto/login.dto';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExparation: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(req: Request, { phoneNumber }: Pick<LoginDto, 'phoneNumber'>) {
    const accessToken = req.get('Authorization').split(' ')[1].trim();
    return { phoneNumber, accessToken };
  }
}
