import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { INVALID_INN } from 'src/messages.constant';

@Injectable()
export class InnValidationPipe implements PipeTransform {
  transform(value: string) {
    if (value.match(/^[\d]{10}$/)) {
      return value;
    }

    throw new BadRequestException(INVALID_INN);
  }
}
