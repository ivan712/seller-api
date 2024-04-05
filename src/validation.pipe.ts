import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { VALIDATION_ERROR } from './messages.constant';

export const ValidationDataPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true },
  stopAtFirstError: true,
  exceptionFactory: () => {
    return new BadRequestException(VALIDATION_ERROR);
  },
});
