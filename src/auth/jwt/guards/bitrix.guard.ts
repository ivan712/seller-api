import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UNAUTHORIZED } from 'src/messages.constant';

@Injectable()
export class BitrixAuthGuard extends AuthGuard('local') {
  private bitrixAuthSecret;
  constructor(configService: ConfigService) {
    super();
    this.bitrixAuthSecret = configService.get('BITRIX_AUTH_SECRET');
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers['authorization'];

    if (!authToken || authToken !== this.bitrixAuthSecret)
      throw new UnauthorizedException(UNAUTHORIZED);

    return true;
  }
}
