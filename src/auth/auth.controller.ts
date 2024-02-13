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
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './jwt/guards/refresh-token.guard';
import { TokenInfo } from './jwt/decorators/token.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtUpdateGuard } from './jwt/guards/update-data-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @UseGuards(JwtUpdateGuard)
  @Put('password')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: 200,
    description: 'Password has been changed succesfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'password is not strong enough',
  })
  async updatePassword(
    @Body() dto: CreatePasswordDto,
    @TokenInfo()
    { tokenId, phoneNumber }: { tokenId: string; phoneNumber: string },
  ) {
    await this.authService.updatePassword(dto.password, phoneNumber, tokenId);
  }

  @Put('preregister')
  @ApiOperation({ summary: 'Updates a note with specified id' })
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
    @TokenInfo()
    { phoneNumber, tokenId }: { phoneNumber: string; tokenId: string },
  ) {
    return this.authService.refresh(phoneNumber, tokenId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(
    @TokenInfo()
    { tokenId }: { tokenId: string },
  ) {
    return this.authService.logout(tokenId);
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
