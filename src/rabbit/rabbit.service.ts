import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Organisation } from '../organisation/organisation.entity';

@Injectable()
export class RabbitService {
  constructor(private amqpConnection: AmqpConnection) {}

  async createOrg(newOrg: Organisation) {
    return await this.amqpConnection.publish(
      'bitrix',
      'bitrix.key.create.org',
      newOrg,
      {
        replyTo: 'bitrix.queue.create.org.response',
      },
    );
  }
}
