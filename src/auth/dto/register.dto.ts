import { IsPhoneNumber, Matches } from 'class-validator';

export class RegisterDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @Matches(/^[\d]{4}$/)
  verificationCode: string;
}
