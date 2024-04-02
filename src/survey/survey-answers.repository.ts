import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ISurveyAnswersRepository } from './survey-answers.interface';
import { SurveyAnswer } from './answer.entity';
import { IDbOptions } from '../db/db-options.interface';
import { Repository } from '../db/repository';
import { Organization } from '../organization/organization.entity';

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
  ): Promise<SurveyAnswer | null> {
    const pgDoc = await this.getClient(dbOptions).surveyAnswer.findUnique({
      where: {
        userId: id,
      },
    });

    if (!pgDoc) return null;

    return new SurveyAnswer({ pgDoc });
  }

  async getAnswersWithOrg(
    dbOptions?: IDbOptions,
  ): Promise<{ surveyAnswer: SurveyAnswer; orgInfo: Organization }[]> {
    const pgDocs = await this.getClient(dbOptions).surveyAnswer.findMany({
      include: { user: { include: { organization: true } } },
    });

    return pgDocs.map((pgDoc) => {
      const surveyAnswer = new SurveyAnswer({ pgDoc });
      const orgInfo = new Organization({ pgDoc: pgDoc.user.organization });

      return { surveyAnswer, orgInfo };
    });
  }

  async create(
    userId: string,
    answers: SurveyAnswer,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).surveyAnswer.create({
      data: { ...answers, userId },
    });
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
