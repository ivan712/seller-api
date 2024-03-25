import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { INVALID_INN } from '../messages.constant';

@Injectable()
export class InnValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value.match(/^\d{10}(?:\d{2})?$/)) {
      return value;
    }

    throw new BadRequestException(INVALID_INN);
  }
}
