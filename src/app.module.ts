import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { SurveyModule } from './survey/survey.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    OrganizationModule,
    RabbitModule,
    SurveyModule,
    AdminModule,
  ],
  controllers: [],
  providers: [UserService, ConfigService],
})
export class AppModule {}
