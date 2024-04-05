import { Transform } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

export class PhoneNumberDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;
}
