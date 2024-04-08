import { IsPhoneNumber, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RegisterDto {
  @IsPhoneNumber('RU')
  @Transform((data) => data.value.replace(/[^!\d]/g, ''))
  phoneNumber: string;

  @Matches(new RegExp(`^[\\d]{${process.env.VERIFICATION_CODE_LENGTH}}$`))
  validationCode: string;
}
