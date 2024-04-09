import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, ORG_NOT_FOUND } from '../../messages.constant';

export const apiBodyRejectSchema = {
  schema: {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        example: 'We have not found organization with such inn',
        description: 'Admin comment',
      },
    },
  },
};

export const invalidRoleSchema = {
  status: HttpStatus.FORBIDDEN,
  description: 'Role is not admin',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Forbidden resource',
      },
      error: {
        type: 'string',
        example: 'Forbidden',
      },
      statusCode: {
        type: 'integer',
        example: HttpStatus.FORBIDDEN,
      },
    },
  },
};

export const successGetAllAplicationsSchema = {
  status: HttpStatus.OK,
  description: 'All aplications. An application contains survey and org info.',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      example: {
        surveyAnswer: {
          region: 'MO',
          city: 'Moscow',
          salePlace: 'RF',
          mandatoryCertification: true,
          productCategory: ['ForHome'],
          workingModel: 'FBO',
          experienceOnOthersMarketplaces: true,
        },
        orgInfo: {
          id: '68ff8c6c-cbdf-4588-b224-3b35c33be9d9',
          inn: '132808730606',
          name: 'ИП Чекамеев Алексей Петрович',
          type: 'INDIVIDUAL',
          ogrn: '323508100370608',
          taxSystem: 'osno',
          legalAddress: '141100, Московская обл, г Щёлково, деревня Протасово',
          status: 'rejected',
          adminComment: 'We have not found organization with such inn',
        },
      },
    },
  },
};

export const successOrgConfirmOrRejectSchema = {
  status: HttpStatus.OK,
  description: 'Successful confirmation of the organization registration',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: OK_MESSAGE,
      },
    },
  },
};

export const notFoundOrgConfirmOrRejectSchema = {
  status: HttpStatus.NOT_FOUND,
  description: 'Not Found',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: HttpStatus.NOT_FOUND,
      },
      error: {
        type: 'string',
        example: 'Not Found',
      },
      message: {
        type: 'string',
        example: ORG_NOT_FOUND,
      },
    },
  },
};
