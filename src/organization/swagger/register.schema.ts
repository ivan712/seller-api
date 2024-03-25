import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, ORG_ALREADY_EXIST } from '../../messages.constant';

export const apiBodyOrgRegisterSchema = {
  schema: {
    type: 'object',
    properties: {
      inn: {
        type: 'string',
        example: '1234567890',
        description:
          'Organization inn. 12 digits for individual and 10 for legal',
      },
      name: {
        type: 'string',
        example: 'Gazprom',
        description: 'Organization name',
      },
      type: {
        type: 'string',
        example: 'LEGAL',
        description: 'Organization type. LEGAL or INDIVIDUAL',
      },
      ogrn: {
        type: 'string',
        example: '1234567890123',
        description: 'Organization ogrn. 13 digits',
      },
      legalAddress: {
        type: 'string',
        example: 'Pushkina street, h.1',
        description: 'Organization address',
      },
    },
  },
};

export const successOrgRegisterSchema = {
  status: HttpStatus.CREATED,
  description: 'Organization has been created',
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

export const badRequestOrgRegisterSchema = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: HttpStatus.BAD_REQUEST,
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
      message: {
        type: 'string',
        example: ORG_ALREADY_EXIST,
      },
    },
  },
};
