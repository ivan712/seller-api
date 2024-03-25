import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SurveyAnswer } from './answer.entity';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { ISurveyAnswersRepository } from './survey-answers.interface';
import { OrganizationRepository } from '../organization/organization.repository';
import { IOrganizationRepository } from '../organization/interfaces/organization-repository.interface';
import {
  NOT_FOUND_INFO_ABOUT_ORG,
  SURVEY_ANSWERS_ALREADY_EXIST,
} from '../messages.constant';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyAnswersRepository)
    private surveyAnswersRepository: ISurveyAnswersRepository,
    @Inject(OrganizationRepository)
    private organizationRepository: IOrganizationRepository,
  ) {}

  async answerQuestions(userId: string, answers: SurveyAnswer): Promise<void> {
    const org = await this.organizationRepository.getByUserId(userId);
    if (!org) throw new NotFoundException(NOT_FOUND_INFO_ABOUT_ORG);

    const isAnswersExist =
      await this.surveyAnswersRepository.getAnswersByUserId(userId);

    if (isAnswersExist)
      throw new BadRequestException(SURVEY_ANSWERS_ALREADY_EXIST);

    await this.surveyAnswersRepository.create(userId, answers);
  }

  async getUserAnswers(userId: string): Promise<SurveyAnswer> {
    return this.surveyAnswersRepository.getAnswersByUserId(userId);
  }
}
