import { Transform } from 'class-transformer';
import { IsPhoneNumber, Matches } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

export class ResetPasswordDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @Matches(new RegExp(`^[\\d]{${process.env.VERIFICATION_CODE_LENGTH}}$`))
  validationCode: string;
}
