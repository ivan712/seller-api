import { AuthGuard } from '@nestjs/passport';

export class JwtUpdateGuard extends AuthGuard('jwt-update-data') {}
