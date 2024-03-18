import { HttpStatus } from '@nestjs/common';
import { NOT_FOUND_INFO_ABOUT_ORG, OK_MESSAGE } from '../../messages.constant';

export const apiAnswerQuestionsSchema = {
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
      sellingOtherMarketplace: {
        type: 'string',
        example: true,
        sellingOtherMarketplace:
          'Do you have any sales experience on other marketplaces?',
      },
    },
  },
};

export const successAnswerQuestionsSchema = {
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

export const badRequestNotFoundOrgSchema = {
  status: HttpStatus.NOT_FOUND,
  description: "User's organisation not found",
  schema: {
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: HttpStatus.NOT_FOUND,
      },
      message: {
        type: 'string',
        example: NOT_FOUND_INFO_ABOUT_ORG,
      },
    },
  },
};