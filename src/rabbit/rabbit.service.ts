import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { Organization } from '../organization/organization.entity';
import { SurveyAnswer } from '../survey/answer.entity';

@Injectable()
export class RabbitService {
  constructor(private amqpConnection: AmqpConnection) {}

  async sendToModeration(moderationData: {
    org: Organization;
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
