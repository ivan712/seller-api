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
import { JwtRefreshGuard } from './jwt/refresh-token.guard';
import { RefreshTokenInfo } from './jwt/refresh-token.decorator';
import { UserDecorator } from './jwt/user.decorator';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async createPassword(
    @Body() dto: CreatePasswordDto,
    @UserDecorator() user: User,
  ) {
    await this.authService.updatePassword(dto.password, user.phoneNumber);
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

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @RefreshTokenInfo()
    { phoneNumber, token }: { phoneNumber: string; token: string },
  ) {
    return this.authService.refresh(phoneNumber, token);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(
    @RefreshTokenInfo()
    { phoneNumber, token }: { phoneNumber: string; token: string },
  ) {
    return this.authService.logout(phoneNumber, token);
  }

  @Post('password/reset/request')
  @HttpCode(200)
  async passwordResetRequest(@Body() dto: Pick<PreregisterDto, 'phoneNumber'>) {
    return this.authService.passwordResetRequest(dto.phoneNumber);
  }

  @Post('password/reset/confirm')
  @HttpCode(200)
  async passwordResetConfirm(@Body() dto: RegisterDto) {
    return this.authService.passwordResetConfirm(
      dto.phoneNumber,
      dto.verificationCode,
    );
  }
}
