import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { RabbitModule } from '../rabbit/rabbit.module';

@Module({
  imports: [PrismaModule, HttpModule, UserModule, RabbitModule],
  providers: [
    OrganisationService,
    OrganisationRepository,
    InnValidationPipe,
    ConfigService,
  ],
  controllers: [OrganisationController],
  exports: [OrganisationService, OrganisationRepository],
})
export class OrganisationModule {}
