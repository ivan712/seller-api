import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, USER_ALREADY_EXIST } from '../../messages.constant';

export const apiBodyPreregisterSchema = {
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        type: 'string',
        example: '+7-985-682-91-01',
        description: 'phone number',
      },
    },
  },
};

export const successPreregisterSchema = {
  status: HttpStatus.OK,
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

export const badRequestPreregisterSchema = {
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
