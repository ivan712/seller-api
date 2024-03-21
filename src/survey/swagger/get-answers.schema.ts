import { HttpStatus } from '@nestjs/common';

export const successGetUserAnswerSchema = {
  status: HttpStatus.OK,
  description: "Get user's answers",
  schema: {
    type: 'object',
    properties: {
      region: {
        type: 'string',
        example: 'MO',
        description: 'Seller region',
      },
      city: {
        type: 'string',
        example: 'Moscow',
        description: 'Seller city',
      },
      salePlace: {
        type: 'string',
        example: 'RF',
        description:
          "Sales either in seller's region or throughout the Russian Federation",
      },
      mandatoryCertification: {
        type: 'boolean',
        example: true,
        description: 'Are the goods sold subject to mandatory certification?',
      },
      productCategory: {
        type: 'array',
        items: {
          type: 'string',
          example: 'ForHome',
        },
      },
      workingModel: {
        type: 'string',
        example: 'FBO',
        description: 'Working model: FBO or FBS',
      },
      experienceOnOthersMarketplaces: {
        type: 'string',
        example: true,
        experienceOnOthersMarketplaces:
          'Do you have any sales experience on other marketplaces?',
      },
    },
  },
};

export const invalidAccessTokenSchema = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid access token',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
      statusCode: {
        type: 'integer',
        example: HttpStatus.UNAUTHORIZED,
      },
    },
  },
};
