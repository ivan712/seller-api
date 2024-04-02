import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UNAUTHORIZED } from '../../../messages.constant';

@Injectable()
export class AdminAuthGuard extends AuthGuard('local') {
  private adminAuthSecret;
  constructor(configService: ConfigService) {
    super();
    this.adminAuthSecret = configService.get('ADMIN_AUTH_SECRET');
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers['authorization'];

    if (!authToken || authToken !== this.adminAuthSecret)
      throw new UnauthorizedException(UNAUTHORIZED);

    return true;
  }
}
