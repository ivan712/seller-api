import { IsPhoneNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString()
  name: string;

  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @Matches(/^[\d]{6}$/)
  validationCode: string;
}
