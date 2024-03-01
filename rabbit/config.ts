import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

export const getRabbitMQConfig = (
  configService: ConfigService,
): RabbitMQConfig => {
  return {
    exchanges: [
      {
        name: configService.get('BITRIX_EXCHANGE_NAME'),
        type: configService.get('BITRIX_EXCHANGE_TYPE'),
      },
    ],
    queues: [
      {
        name: configService.get('BITRIX_LETTER_QUEUE'),
        options: {
          noAck:
            configService.get('BITRIX_LETTER_QUEUE_NOACK_OPTION') === 'false'
              ? false
              : true,
          deadLetterExchange: configService.get('BITRIX_DEAD_LETTER_QUEUE'),
          durable:
            configService.get('BITRIX_LETTER_QUEUE_DURABLE') === 'true'
              ? true
              : false,
          deadLetterRoutingKey: configService.get(
            'BITRIX_DEAD_LETTER_ROUTING_KEY',
          ),
        },
        exchange: configService.get('BITRIX_EXCHANGE_NAME'),
        routingKey: configService.get('BITRIX_LETTER_QUEUE_ROUTING_KEY'),
      },
      {
        name: configService.get('BITRIX_DEAD_LETTER_QUEUE'),
        options: {
          noAck:
            configService.get('BITRIX_DEAD_LETTER_QUEUE_NOACK_OPTION') ===
            'false'
              ? false
              : true,
          deadLetterExchange: configService.get('BITRIX_EXCHANGE_NAME'),
          durable: true,
          deadLetterRoutingKey: 'my',
          messageTtl: 60000,
        },
        exchange: 'my-exchange',
        routingKey: 'dead',
      },
    ],
    uri: 'amqp://admin:admin@localhost:5672',
  };
};
