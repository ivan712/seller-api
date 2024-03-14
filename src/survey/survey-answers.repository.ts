import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ISurveyAnswersRepository } from './survey-answers.interface';
import { SurveyAnswer } from './answer.entity';
import { IDbOptions } from '../shared/db-options.interface';
import { Repository } from 'src/shared/repository';

@Injectable()
export class SurveyAnswersRepository
  extends Repository
  implements ISurveyAnswersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async getAnswersByUserId(
    id: string,
    dbOptions?: IDbOptions,
  ): Promise<SurveyAnswer> {
    const pgDoc = await this.getClient(dbOptions).surveyAnswer.findUnique({
      where: {
        userId: id,
      },
    });

    return new SurveyAnswer({ pgDoc });
  }

  async upsert(
    userId: string,
    answers: SurveyAnswer,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).surveyAnswer.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ...answers,
      },
      update: {
        ...answers,
      },
    });
  }

  async deleteByUserId(userId: string, dbOptions?: IDbOptions): Promise<void> {
    await this.getClient(dbOptions).surveyAnswer.delete({
      where: {
        userId,
      },
    });
  }
}
