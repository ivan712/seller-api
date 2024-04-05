import { Transform } from 'class-transformer';
import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @IsString()
  name: string;
}
