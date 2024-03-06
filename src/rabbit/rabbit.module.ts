import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { OrganisationModule } from '../organisation/organisation.module';

@Module({
  imports: [OrganisationModule],
  providers: [RabbitService],
})
export class RabbitModule {}
