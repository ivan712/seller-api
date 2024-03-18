import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SurveyAnswer } from './answer.entity';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { ISurveyAnswersRepository } from './survey-answers.interface';
import { OrganisationRepository } from '../organisation/organisation.repository';
import { IOrganisationRepository } from '../organisation/interfaces/organisation-repository.interface';
import {
  NOT_FOUND_INFO_ABOUT_ORG,
  SURVEY_ANSWERS_ALREADY_EXIST,
} from '../messages.constant';
import { PrismaService } from '../db/prisma.service';
import { RabbitService } from '../rabbit/rabbit.service';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyAnswersRepository)
    private surveyAnswersRepository: ISurveyAnswersRepository,
    @Inject(OrganisationRepository)
    private organisationRepository: IOrganisationRepository,
    private prismaService: PrismaService,
    private rabbitService: RabbitService,
  ) {}

  async answerQuestions(userId: string, answers: SurveyAnswer): Promise<void> {
    const org = await this.organisationRepository.getByUserId(userId);
    if (!org) throw new NotFoundException(NOT_FOUND_INFO_ABOUT_ORG);

    const isAnswersExist =
      await this.surveyAnswersRepository.getAnswersByUserId(userId);

    if (isAnswersExist)
      throw new BadRequestException(SURVEY_ANSWERS_ALREADY_EXIST);

    await this.prismaService.$transaction(async (trxn) => {
      await this.surveyAnswersRepository.create(userId, answers, { trxn });

      const isSentToRabbit = await this.rabbitService.sendToModeration({
        org,
        surveyAnswers: answers,
      });
      if (!isSentToRabbit) throw new InternalServerErrorException();
    });
  }

  async getUserAnswers(userId: string): Promise<SurveyAnswer> {
    return this.surveyAnswersRepository.getAnswersByUserId(userId);
  }
}
