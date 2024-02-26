import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { UserRepository } from '../user/user.repository';
import { ThirdPartyApiModule } from '../third-party-api/third-party-api.module';

@Module({
  imports: [PrismaModule, ThirdPartyApiModule],
  providers: [
    OrganisationService,
    OrganisationRepository,
    InnValidationPipe,
    UserRepository,
  ],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
