import { HttpStatus } from '@nestjs/common';
import { OK_MESSAGE, ORG_NOT_FOUND } from '../../messages.constant';

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
      message: {
        type: 'string',
        example: ORG_NOT_FOUND,
      },
    },
  },
};
