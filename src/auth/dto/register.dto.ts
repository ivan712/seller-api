import { IsEnum, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { Role } from '../../user/roles.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsPhoneNumber()
  phoneNumber: string;

  @Matches(/^[\d]{6}$/)
  validationCode: string;
}
