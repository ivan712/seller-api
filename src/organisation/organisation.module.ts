import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { UserRepository } from '../user/user.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { getRabbitMQConfig } from 'rabbit/config';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
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
    UserRepository,
    ConfigService,
  ],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
