import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { bitrixCreateOrgResponseSudscriberConfig } from './config';
import { OrganisationService } from 'src/organisation/organisation.service';
import { OrgStatus } from 'src/organisation/organisation.entity';

@Injectable()
export class RabbitService {
  constructor(private organisationService: OrganisationService) {}

  @RabbitSubscribe({
    ...bitrixCreateOrgResponseSudscriberConfig,
    errorHandler: defaultNackErrorHandler,
  })
  public async handleBitrixCreateOrgResponseMessage(message: { inn: string }) {
    console.log('message 1', message);
    await this.organisationService.updateOrgData(message.inn, {
      status: OrgStatus.ON_MODERATION,
    });
  }
}
