import { IsPhoneNumber } from 'class-validator';

export class PreregisterDto {
  @IsPhoneNumber()
  phoneNumber: string;
}
