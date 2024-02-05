import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-user.dto';
import { Role } from 'src/user/roles.enum';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserService) private userService: UserService,
  ) {}
  @Post('password')
  async createPassword(@Body() dto: CreatePasswordDto) {
    //hardcode
    await this.authService.createPassword(dto.password, '79856829336');
  }

  @Post('preregister')
  async registerOrganisationAdmin(@Body() dto: RegisterDto) {
    return this.authService.register({ ...dto, role: Role.ADMIN });
  }
}
