import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';

@Module({
  imports: [PrismaModule],
  providers: [OrganisationService, OrganisationRepository, InnValidationPipe],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
