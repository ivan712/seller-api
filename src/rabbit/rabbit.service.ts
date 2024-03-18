import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Organisation } from '../organisation/organisation.entity';
import { SurveyAnswer } from '../survey/answer.entity';

@Injectable()
export class RabbitService {
  constructor(private amqpConnection: AmqpConnection) {}

  async sendToModeration(moderationData: {
    org: Organisation;
    surveyAnswers: SurveyAnswer;
  }) {
    return await this.amqpConnection.publish(
      'bitrix',
      'bitrix.key.create.org',
      moderationData,
      {
        replyTo: 'bitrix.queue.create.org.response',
      },
    );
  }
}
