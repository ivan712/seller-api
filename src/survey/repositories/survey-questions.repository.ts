import { Injectable } from '@nestjs/common';
import { ISurveyQuestionsRepository } from '../interfaces/survey-questions.interface';
import { SurveyQuestion } from '../entities/question.entity';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class SurveyQuestionsRepository implements ISurveyQuestionsRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(dbOptions?: any): PrismaService {
    const trxn = dbOptions?.trxn;
    const client = trxn ? trxn : this.prisma;
    return client;
  }

  async create(question: string, dbOptions?: any): Promise<void> {
    await this.getClient(dbOptions).surveyQuestion.create({
      data: { question },
    });
  }

  async getById(id: string, dbOptions?: any): Promise<SurveyQuestion | null> {
    const pgDoc = await this.getClient(dbOptions).surveyQuestion.findFirst({
      where: { id: Number(id) },
    });

    if (!pgDoc) return null;

    return new SurveyQuestion({ pgDoc });
  }

  async delete(id: string, dbOptions?: any): Promise<void> {
    await this.getClient(dbOptions).surveyQuestion.delete({
      where: { id: Number(id) },
    });
  }

  async update(
    id: string,
    data: Omit<SurveyQuestion, 'id'>,
    dbOptions?: any,
  ): Promise<void> {
    await this.getClient(dbOptions).surveyQuestion.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }

  async getAll(dbOptions?: any): Promise<SurveyQuestion[]> {
    const pgDocs = await this.getClient(dbOptions).surveyQuestion.findMany();
    return pgDocs.map((q) => new SurveyQuestion({ pgDoc: q }));
  }
}
