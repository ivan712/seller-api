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
  status: 200,
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
  description: 'Invalid jwt update token',
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

export const badRequestPasswordUpdateSchema = {
  status: 400,
  description: 'Password is not strong enough',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: 400,
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
      message: {
        type: 'array',
        items: {
          type: 'string',
          example: 'Password is not strong enough',
        },
      },
    },
  },
};
