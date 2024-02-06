import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { AuthService } from './auth.service';
import { PreregisterDto } from './dto/pre-register.dto';
import { Role } from 'src/user/roles.enum';
import { RegisterDto } from './dto/register.dto';
import { UserStatus } from 'src/user/user.status';
import { JwtAuthGuard } from './jwt/access-token.guard';
import { LoginDto } from './dto/login.dto';
import { PhoneNumber } from './jwt/phone-number.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async createPassword(
    @Body() dto: CreatePasswordDto,
    @PhoneNumber() phoneNumber: string,
  ) {
    console.log(phoneNumber);
    await this.authService.updatePassword(dto.password, phoneNumber);
  }

  @Post('preregister/admin')
  async preregisterOrganisationAdmin(@Body() dto: PreregisterDto) {
    return this.authService.preregister({
      ...dto,
      role: Role.ADMIN,
      status: UserStatus.PREREGISTER,
    });
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.verificationCode, dto.phoneNumber);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.phoneNumber, dto.password);
  }
}
