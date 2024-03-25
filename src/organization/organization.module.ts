import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, HttpModule, UserModule],
  providers: [
    OrganizationService,
    OrganizationRepository,
    InnValidationPipe,
    ConfigService,
  ],
  controllers: [OrganizationController],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
