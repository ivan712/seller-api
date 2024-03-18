import { HttpStatus } from '@nestjs/common';

export const successUserInfoSchema = {
  status: HttpStatus.OK,
  description: 'User info. Role should be owner or user',
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'eb66d0f3-0d45-4bc2-b581-f1889e3219aa',
      },
      name: {
        type: 'string',
        example: 'Ivan',
      },
      phoneNumber: {
        type: 'string',
        example: '79856829101',
      },
      role: {
        type: 'string',
        example: 'owner',
      },
      org: {
        type: 'object',
        example: {
          id: '29257343-ecfb-4f9d-b395-c062ab810dc3',
          inn: '1234567890',
          name: 'Gazprom',
          type: 'LEGAL',
          ogrn: '1234567890123',
          legalAddress: 'Pushkina street, h.1',
        },
      },
    },
  },
};

export const invalidUserAccessToken = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid access token',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
      statusCode: {
        type: 'integer',
        example: HttpStatus.UNAUTHORIZED,
      },
    },
  },
};
