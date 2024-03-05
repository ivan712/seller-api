import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { bitrixCreateOrgResponseSudscriberConfig } from './config';

@Injectable()
export class RabbitService {
  @RabbitSubscribe({
    ...bitrixCreateOrgResponseSudscriberConfig,
    errorHandler: defaultNackErrorHandler,
  })
  public async handleBitrixCreateOrgResponseMessage(message: { inn: string }) {
    console.log('message 1', message);
    await new Promise<void>((res) => {
      setTimeout(() => res(), 5000);
    });

    console.log('message', message);
  }
}
