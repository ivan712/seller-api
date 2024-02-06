import { IsPhoneNumber, IsString } from 'class-validator';

export class PreregisterDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  name: string;
}
