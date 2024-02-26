import { HttpStatus } from '@nestjs/common';

export const successRefreshSchema = {
  status: HttpStatus.OK,
  description: 'Refresh access and refresh tokens',
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

export const invalidRefreshTokenSchema = {
  status: 401,
  description: 'Invalid refresh token',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
      statusCode: {
        type: 'integer',
        example: 401,
      },
    },
  },
};
