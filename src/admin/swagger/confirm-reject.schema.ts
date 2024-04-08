import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, ORG_NOT_FOUND } from '../../messages.constant';

export const apiBodyRejectSchema = {
  schema: {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        example: 'We have not found organization with such inn',
        description: 'Admin comment',
      },
    },
  },
};

export const successOrgConfirmOrRejectSchema = {
  status: HttpStatus.OK,
  description: 'Successful confirmation of the organization registration',
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

export const notFoundOrgConfirmOrRejectSchema = {
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
        example: ORG_NOT_FOUND,
      },
    },
  },
};
