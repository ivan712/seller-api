import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy } from './jwt/access.strategy';
import { RolesGuard } from './jwt/roles.guard';
import { RefreshTokenStrategy } from './jwt/refresh.strategy';
import { RefreshTokenRepository } from './refresh-token.repository';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
    PrismaModule,
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    RefreshTokenRepository,
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
