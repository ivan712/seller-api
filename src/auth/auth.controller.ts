import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { AuthService } from './auth.service';
import { PreregisterDto } from './dto/pre-register.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt/access-token.guard';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './jwt/refresh-token.guard';
import { RefreshTokenInfo } from './jwt/refresh-token.decorator';
import { PhoneNumberDecorator } from './jwt/phone-number.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async createPassword(
    @Body() dto: CreatePasswordDto,
    @PhoneNumberDecorator() phoneNumber: string,
  ) {
    await this.authService.updatePassword(dto.password, phoneNumber);
  }

  @Put('preregister')
  @ApiOperation({ summary: 'Updates a note with specified id' })
  // @ApiBody({
  //   schema: PreregisterDto,
  //   required: true,
  //   description: 'Note identifier',
  // })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Note })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async preregister(@Body() dto: PreregisterDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');

    return this.authService.preregister({
      ...dto,
    });
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');

    return this.authService.register(
      { phoneNumber: dto.phoneNumber, name: dto.name, role: dto.role },
      dto.validationCode,
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
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
    { token }: { token: string },
  ) {
    return this.authService.logout(token);
  }

  @Post('password/reset/request')
  @HttpCode(200)
  async passwordResetRequest(@Body() dto: Pick<PreregisterDto, 'phoneNumber'>) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
    return this.authService.passwordResetRequest(dto.phoneNumber);
  }

  @Post('password/reset/confirm')
  @HttpCode(200)
  async passwordResetConfirm(@Body() dto: ResetPasswordDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
    return this.authService.passwordResetConfirm(
      dto.phoneNumber,
      dto.validationCode,
    );
  }
}
