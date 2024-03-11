import { Injectable } from '@nestjs/common';
import { ISurveyQuestionsRepository } from '../interfaces/survey-questions.interface';
import { SurveyQuestion } from '../entities/question.entity';
import { PrismaService } from 'src/db/prisma.service';
import { ISurveyAnswersRepository } from '../interfaces/survey-answers.interface';

@Injectable()
export class SurveyAnswersRepository implements ISurveyAnswersRepository {
  constructor(private prisma: PrismaService) {}

  private getClient(dbOptions?: any): PrismaService {
    const trxn = dbOptions?.trxn;
    return trxn ? trxn : this.prisma;
  }

  async create(
    userId: string,
    questionId: number,
    answer: string,
    dbOptions?: any,
  ): Promise<void> {
    
  }
}
