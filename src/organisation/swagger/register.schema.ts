import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE } from '../../messages.constant';

export const apiBodyOrgRegisterSchema = {
  schema: {
    type: 'object',
    properties: {
      inn: {
        type: 'string',
        example: '1234567890',
        description:
          'Organisation inn. 12 digits for individual and 10 for legal',
      },
      name: {
        type: 'string',
        example: 'Gazprom',
        description: 'Organisation name',
      },
      type: {
        type: 'string',
        example: 'LEGAL',
        description: 'Organisation type. LEGAL or INDIVIDUAL',
      },
      ogrn: {
        type: 'string',
        example: '1234567890123',
        description: 'Organisation ogrn. 13 digits',
      },
      legalAddress: {
        type: 'string',
        example: 'Pushkina street, h.1',
        description: 'Organisation address',
      },
    },
  },
};

export const successOrgRegisterSchema = {
  status: HttpStatus.CREATED,
  description: 'Organisation has been created',
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
