import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { OrganizationRepository } from '../organization/organization.repository';
import { Organization } from '../organization/organization.entity';
import { SurveyAnswersRepository } from './survey-answers.repository';
import { SurveyAnswer } from './answer.entity';
import {
  NOT_FOUND_INFO_ABOUT_ORG,
  SURVEY_ANSWERS_ALREADY_EXIST,
} from '../messages.constant';

describe('SurveyService', () => {
  let surveyService: SurveyService;
  let organizationRepository: DeepMocked<OrganizationRepository>;
  let surveyAnswersRepository: DeepMocked<SurveyAnswersRepository>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyService],
    })
      .useMocker(createMock)
      .compile();

    surveyService = module.get<SurveyService>(SurveyService);
    organizationRepository = module.get(OrganizationRepository);
    surveyAnswersRepository = module.get(SurveyAnswersRepository);
  });

  describe('answer question', () => {
    const userId = 'user-id';
    const answers = { userId } as unknown as SurveyAnswer;

    it('success', async () => {
      organizationRepository.getByUserId.mockImplementationOnce((userId) =>
        Promise.resolve({ userId } as unknown as Organization),
      );
      surveyAnswersRepository.getAnswersByUserId.mockResolvedValue(null);

      const spyMock = jest.spyOn(surveyAnswersRepository, 'create');

      expect(await surveyService.answerQuestions(userId, answers));
      expect(spyMock).toHaveBeenCalledWith(userId, answers);
    });

    it('organization not found', async () => {
      organizationRepository.getByUserId.mockResolvedValueOnce(null);

      expect(surveyService.answerQuestions(userId, answers)).rejects.toThrow(
        NOT_FOUND_INFO_ABOUT_ORG,
      );
    });

    it('user has already answered', async () => {
      organizationRepository.getByUserId.mockImplementationOnce((userId) =>
        Promise.resolve({ userId } as unknown as Organization),
      );

      surveyAnswersRepository.getAnswersByUserId.mockResolvedValue(answers);

      expect(surveyService.answerQuestions(userId, answers)).rejects.toThrow(
        SURVEY_ANSWERS_ALREADY_EXIST,
      );
    });
  });

  describe('get answers', () => {
    it('success', async () => {
      const userId = 'user-id';

      surveyAnswersRepository.getAnswersByUserId.mockImplementationOnce(
        (userId) => Promise.resolve({ userId } as unknown as SurveyAnswer),
      );

      expect(await surveyService.getUserAnswers(userId)).toMatchObject({
        userId,
      });
    });
  });
});
