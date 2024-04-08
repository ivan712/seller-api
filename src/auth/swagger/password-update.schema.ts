import { HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED, VALIDATION_ERROR } from '../../messages.constant';

export const apiBodyPasswordUpdateSchema = {
  schema: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        example: 'Hello123!',
        description: 'password',
      },
    },
  },
};

export const successPasswordUpdateSchema = {
  status: HttpStatus.OK,
  description: 'Password has been changed or created succesfully',
  schema: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4MzQxMDd9.dRQi5oo_HT7PA87k5mTeUdYfmzGb924bFlzbB7pkyqs',
      },
      refreshToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4NjY1MDcsImp0aSI6IjVlZjcxNTkzNmZmMTE4NWE0ZTc2NTgwNDkxIn0.1vd4KUc6vAHN2apLFycdHhx0AayLY95pVE7uFwfVaVE',
      },
    },
  },
};

export const invalidUpdateTokenSchema = {
  status: 401,
  description: 'Invalid or expired jwt update token',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: UNAUTHORIZED,
      },
      statusCode: {
        type: 'integer',
        example: HttpStatus.UNAUTHORIZED,
      },
    },
  },
};

export const badRequestPasswordUpdateSchema = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Password is not strong enough',
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
        example: VALIDATION_ERROR,
      },
    },
  },
};
