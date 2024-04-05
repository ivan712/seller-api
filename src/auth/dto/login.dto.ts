import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @IsStrongPassword()
  password: string;
}
