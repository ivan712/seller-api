import { IsPhoneNumber, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @Matches(/^[\d]{4}$/)
  validationCode: string;
}
