import { IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  name: string;
}
