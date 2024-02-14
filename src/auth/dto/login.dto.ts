import { IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsStrongPassword()
  password: string;
}
