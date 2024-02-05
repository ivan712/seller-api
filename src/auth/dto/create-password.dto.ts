import { IsStrongPassword } from 'class-validator';

export class CreatePasswordDto {
  @IsStrongPassword()
  password: string;
}
