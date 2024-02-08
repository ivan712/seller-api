import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganisationModule } from './organisation/organisation.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, OrganisationModule],
  controllers: [],
  providers: [UserService, ConfigService],
})
export class AppModule {}
