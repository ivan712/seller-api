import { HttpStatus } from '@nestjs/common';
import { INCORRECT_USER_NAME_OR_VALIDATION_CODE } from '../../messages.constant';

export const apiBodyPassResetConfSchema = {
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        type: 'string',
        example: '+7-985-682-91-01',
        description: 'Phone number',
      },
      validationCode: {
        type: 'string',
        example: '012345',
        description: 'Мalidation code',
      },
    },
  },
};

export const successPassResetConfSchema = {
  status: HttpStatus.OK,
  description: 'Get token for password setting',
  schema: {
    type: 'object',
    properties: {
      updateToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODM4MTMzLCJleHAiOjE3MDc4Mzg0MzMsImp0aSI6Ijk2OTkzYmE5ZmE0NmMzYzAzNThlY2RlZGQxIn0.6GIQG-2Dj7LCMFh4O89JacO3UtFTZa5qltiDOpAWYtE',
      },
    },
  },
};

export const badRequestPassResetConfSchema = {
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
        example: INCORRECT_USER_NAME_OR_VALIDATION_CODE,
      },
    },
  },
};
