import { OK_MESSAGE } from '../../messages.constant';

export const successLogoutSchema = {
  status: 200,
  description: 'Logout succesfully',
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
