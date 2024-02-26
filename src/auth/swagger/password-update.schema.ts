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
      message: {
        type: 'string',
        example: 'Ok',
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
