import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMQConfig } from 'src/rabbit/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    UserModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: getRabbitMQConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [
    OrganisationService,
    OrganisationRepository,
    InnValidationPipe,
    ConfigService,
  ],
  controllers: [OrganisationController],
  exports: [OrganisationService],
})
export class OrganisationModule {}
