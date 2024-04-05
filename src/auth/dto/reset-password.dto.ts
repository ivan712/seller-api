import { Transform } from 'class-transformer';
import { IsPhoneNumber, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @Matches(/^[\d]{6}$/)
  validationCode: string;
}
