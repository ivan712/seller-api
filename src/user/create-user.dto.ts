import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  name: string;
}
