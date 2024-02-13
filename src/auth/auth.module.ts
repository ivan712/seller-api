import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy } from './jwt/strategies/access.strategy';
import { RolesGuard } from './jwt/guards/roles.guard';
import { RefreshTokenStrategy } from './jwt/strategies/refresh.strategy';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { PrismaModule } from 'src/db/prisma.module';
import { ValidationDataRepository } from './repositories/validation-data.repository';
import { JwtTokensService } from './jwt/jwt-token.service';
import { CryptoService } from './crypto.service';
import { UpdateTokenStrategy } from './jwt/strategies/update-data.strategy';

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
    UpdateTokenStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtTokensService,
    RefreshTokenRepository,
    ValidationDataRepository,
    RolesGuard,
    CryptoService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
