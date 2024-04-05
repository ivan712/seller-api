import { HttpStatus } from '@nestjs/common';

export const successUserInfoSchema = {
  status: HttpStatus.OK,
  description: 'User info',
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
          status: 'on_moderation',
          ogrn: '1234567890123',
          taxType: 'osno',
          legalAddress: 'Pushkina street, h.1',
          adminComment: 'admin comment',
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
