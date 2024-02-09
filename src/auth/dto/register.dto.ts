import { IsEnum, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { Role } from 'src/user/roles.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsPhoneNumber()
  phoneNumber: string;

  @Matches(/^[\d]{4}$/)
  validationCode: string;
}
