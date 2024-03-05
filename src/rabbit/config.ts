import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

export const getRabbitMQConfig = (
  configService: ConfigService,
): RabbitMQConfig => {
  return {
    exchanges: [
      {
        name: 'bitrix',
        type: 'direct',
      },
    ],
    queues: [
      {
        name: 'bitrix.queue.create.org',
        options: {
          noAck: false,
          deadLetterExchange: 'bitrix',
          durable: true,
          deadLetterRoutingKey: 'bitrix.key.create.org.dead',
        },
        exchange: 'bitrix',
        routingKey: 'bitrix.key.create.org',
      },
      {
        name: 'bitrix.queue.create.org.dead',
        options: {
          noAck: false,
          deadLetterExchange: 'bitrix',
          durable: true,
          deadLetterRoutingKey: 'bitrix.key.create.org',
          messageTtl: Number(
            configService.get('BITRIX_CREATE_ORG_DEAD_QUEUE_TTL'),
          ),
        },
        exchange: 'bitrix',
        routingKey: 'bitrix.key.create.org.dead',
      },
      {
        name: 'bitrix.queue.create.org.response',
        options: {
          noAck: false,
          deadLetterExchange: 'bitrix',
          durable: true,
          deadLetterRoutingKey: 'bitrix.key.create.org.response.dead',
        },
        exchange: 'bitrix',
        routingKey: 'bitrix.key.create.org.response',
      },
      {
        name: 'bitrix.queue.create.org.response.dead',
        options: {
          noAck: false,
          deadLetterExchange: 'bitrix',
          durable: true,
          deadLetterRoutingKey: 'bitrix.key.create.org.response',
          messageTtl: Number(
            configService.get('BITRIX_CREATE_ORG_RESPONSE_DEAD_QUEUE_TTL'),
          ),
        },
        exchange: 'bitrix',
        routingKey: 'bitrix.key.create.org.response.dead',
      },
    ],
    uri: configService.get('RABBIT_URL'),
  };
};

export const bitrixCreateOrgResponseSudscriberConfig = {
  exchange: 'bitrix',
  routingKey: 'bitrix.key.create.org.response',
  queue: 'bitrix.queue.create.org.response',
  queueOptions: {
    deadLetterExchange: 'bitrix',
    deadLetterRoutingKey: 'bitrix.key.create.org.response.dead',
  },
};
