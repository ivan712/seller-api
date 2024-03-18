import { HttpStatus } from '@nestjs/common';
import { USER_ALREADY_EXIST } from '../../messages.constant';

export const apiBodyRegisterSchema = {
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        type: 'string',
        example: '+7-985-682-91-01',
        description: 'phone number',
      },
      validationCode: {
        type: 'string',
        example: '012345',
        description: 'validation code',
      },
      name: {
        type: 'string',
        example: 'Ivan',
        description: "user's name",
      },
      role: {
        type: 'string',
        example: 'owner',
        description: "user's role",
      },
    },
  },
};

export const successRegisterSchema = {
  status: HttpStatus.CREATED,
  description: 'Register user and get token for password setting',
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

export const badRequestRegisterSchema = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: HttpStatus.BAD_REQUEST,
      },
      message: {
        type: 'string',
        example: USER_ALREADY_EXIST,
      },
    },
  },
};
