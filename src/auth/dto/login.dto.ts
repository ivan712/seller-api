import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  password: string;
}
