import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ISurveyAnswersRepository } from '../interfaces/survey-answers.interface';
import { SurveyAnswer } from '../entities/answer.entity';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SurveyAnswersRepository implements ISurveyAnswersRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(dbOptions?: any): PrismaClient {
    const trxn = dbOptions?.trxn;
    return trxn ? trxn : this.prisma;
  }

  async getAnswersByUserId(
    id: string,
    dbOptions?: any,
  ): Promise<SurveyAnswer[]> {
    const pgDocs = await this.getClient(dbOptions).surveyAnswer.findMany({
      include: {
        surveyQuestion: true,
      },
      where: {
        userId: +id,
      },
    });
    console.log('pgDoc', pgDocs);
    return pgDocs.map((a) => new SurveyAnswer({ pgDoc: a }));
  }

  async upsertMany(
    userId: string,
    answers: SurveyAnswer[],
    dbOptions?: any,
  ): Promise<void> {
    console.log('answers', answers);
    await this.deleteByUserId(userId, dbOptions);
    await this.getClient(dbOptions).surveyAnswer.createMany({
      data: answers.map((a) => ({
        userId: +userId,
        questionId: a.questionId,
        answer: a.answer,
      })),
    });
  }

  async deleteByUserId(userId: string, dbOptions?: any): Promise<void> {
    await this.getClient(dbOptions).surveyAnswer.deleteMany({
      where: {
        userId: +userId,
      },
    });
  }
}
