import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { PrismaModule } from '../db/prisma.module';
import { InnValidationPipe } from './inn-validation.pipe';
import { UserRepository } from '../user/user.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [{ name: 'my-exchange', type: 'direct' }],
      queues: [
        {
          name: 'my-queue',
          options: {
            noAck: false,
            deadLetterExchange: 'my-exchange',
            durable: true,
            deadLetterRoutingKey: 'dead',
          },
          exchange: 'my-exchange',
          routingKey: 'my',
        },
        {
          name: 'dead-queue',
          options: {
            noAck: false,
            deadLetterExchange: 'my-exchange',
            durable: true,
            deadLetterRoutingKey: 'my',
            messageTtl: 60000,
          },
          exchange: 'my-exchange',
          routingKey: 'dead',
        },
      ],
      uri: 'amqp://admin:admin@localhost:5672',
    }),
  ],
  providers: [
    OrganisationService,
    OrganisationRepository,
    InnValidationPipe,
    UserRepository,
    ConfigService,
  ],
  controllers: [OrganisationController],
})
export class OrganisationModule {}
