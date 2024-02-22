import { HttpStatus } from '@nestjs/common';
import { INCORRECT_USER_NAME_OR_PASSWORD } from 'src/messages.constant';

export const apiBodyLoginSchema = {
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        type: 'string',
        example: '+7-985-682-91-01',
        description: 'Phone number',
      },
      password: {
        type: 'string',
        example: 'Hello123!',
        description: 'Password',
      },
    },
  },
};

export const successLoginSchema = {
  status: HttpStatus.OK,
  description: 'Get access and refresh tokens',
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

export const badRequestLoginSchema = {
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
        example: INCORRECT_USER_NAME_OR_PASSWORD,
      },
    },
  },
};
