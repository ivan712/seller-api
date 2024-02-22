import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [
    OrganisationService,
    OrganisationRepository,
    InnValidationPipe,
    UserRepository,
  ],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
