import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, USER_NOT_FOUND } from '../../messages.constant';

export const apiBodyPassResetReqSchema = {
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        type: 'string',
        example: '+7-985-682-91-01',
        description: 'Phone number',
      },
    },
  },
};

export const successPassResetReqSchema = {
  status: 200,
  description: 'Sms has been sent to user',
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

export const notFoundPassResetReqSchema = {
  status: HttpStatus.NOT_FOUND,
  description: 'Not Found',
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: HttpStatus.NOT_FOUND,
      },
      error: {
        type: 'string',
        example: 'Not Found',
      },
      message: {
        type: 'string',
        example: USER_NOT_FOUND,
      },
    },
  },
};
