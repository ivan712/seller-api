import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { AuthService } from './auth.service';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './jwt/guards/refresh-token.guard';
import { TokenInfo } from './jwt/decorators/token.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtUpdateGuard } from './jwt/guards/update-data-token.guard';
import { OK_MESSAGE } from '../messages.constant';
import {
  apiBodyPreregisterSchema,
  badRequestPreregisterSchema,
  successPreregisterSchema,
} from './swagger/preregister.schema';
import {
  apiBodyRegisterSchema,
  badRequestRegisterSchema,
  successRegisterSchema,
} from './swagger/register.schema';
import {
  apiBodyPasswordUpdateSchema,
  badRequestPasswordUpdateSchema,
  invalidUpdateTokenSchema,
  successPasswordUpdateSchema,
} from './swagger/password-update.schema';
import {
  apiBodyLoginSchema,
  badRequestLoginSchema,
  successLoginSchema,
} from './swagger/login.schema';
import {
  invalidRefreshTokenSchema,
  successRefreshSchema,
} from './swagger/refresh.schema';
import { successLogoutSchema } from './swagger/logout.schema';
import {
  apiBodyPassResetReqSchema,
  notFoundPassResetReqSchema,
  successPassResetReqSchema,
} from './swagger/password-reset-req.schema';
import {
  apiBodyPassResetConfSchema,
  badRequestPassResetConfSchema,
  successPassResetConfSchema,
} from './swagger/password-reset-conf.schema';
import { ValidationDataPipe } from '../validation.pipe';
import { LoginValidationPipe } from './login-validation.pipe';
import { Role } from '../user/roles.enum';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('preregister')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationDataPipe)
  @ApiOperation({ summary: 'Get sms code for registration' })
  @ApiBody(apiBodyPreregisterSchema)
  @ApiResponse(successPreregisterSchema)
  @ApiResponse(badRequestPreregisterSchema)
  async preregister(@Body() dto: PhoneNumberDto) {
    await this.authService.preregister({
      ...dto,
    });

    return {
      message: OK_MESSAGE,
    };
  }

  @Post('register')
  @UsePipes(ValidationDataPipe)
  @ApiOperation({ summary: 'Register user' })
  @ApiBody(apiBodyRegisterSchema)
  @ApiResponse(successRegisterSchema)
  @ApiResponse(badRequestRegisterSchema)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(
      { phoneNumber: dto.phoneNumber, name: dto.name, role: Role.OWNER },
      dto.validationCode,
    );
  }

  @UseGuards(JwtUpdateGuard)
  @Patch('password/update')
  @ApiBearerAuth()
  @UsePipes(ValidationDataPipe)
  @ApiOperation({ summary: 'Update password' })
  @ApiBody(apiBodyPasswordUpdateSchema)
  @ApiResponse(successPasswordUpdateSchema)
  @ApiResponse(invalidUpdateTokenSchema)
  @ApiResponse(badRequestPasswordUpdateSchema)
  async updatePassword(
    @Body() dto: CreatePasswordDto,
    @TokenInfo()
    { tokenId, userContact }: { tokenId: string; userContact: string },
  ) {
    return this.authService.updatePassword(dto.password, userContact, tokenId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(LoginValidationPipe, ValidationDataPipe)
  @ApiOperation({ summary: 'Login' })
  @ApiBody(apiBodyLoginSchema)
  @ApiResponse(successLoginSchema)
  @ApiResponse(badRequestLoginSchema)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.phoneNumber, dto.password);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UsePipes(ValidationDataPipe)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse(successRefreshSchema)
  @ApiResponse(invalidRefreshTokenSchema)
  async refresh(
    @TokenInfo()
    { userId, tokenId }: { userId: string; tokenId: string },
  ) {
    return this.authService.refresh(userId, tokenId);
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationDataPipe)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse(successLogoutSchema)
  @ApiResponse(invalidRefreshTokenSchema)
  async logout(
    @TokenInfo()
    { tokenId }: { tokenId: string },
  ) {
    await this.authService.logout(tokenId);
    return {
      message: OK_MESSAGE,
    };
  }

  @Post('password/reset/request')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationDataPipe)
  @ApiOperation({ summary: 'Get sms code for password changing' })
  @ApiBody(apiBodyPassResetReqSchema)
  @ApiResponse(successPassResetReqSchema)
  @ApiResponse(notFoundPassResetReqSchema)
  async passwordResetRequest(@Body() dto: PhoneNumberDto) {
    await this.authService.passwordResetRequest(dto.phoneNumber);
    return {
      message: OK_MESSAGE,
    };
  }

  @Post('password/reset/confirm')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationDataPipe)
  @ApiOperation({
    summary: 'Enter sms code and get token for password changing',
  })
  @ApiBody(apiBodyPassResetConfSchema)
  @ApiResponse(successPassResetConfSchema)
  @ApiResponse(badRequestPassResetConfSchema)
  async passwordResetConfirm(@Body() dto: ResetPasswordDto) {
    return this.authService.passwordResetConfirm(
      dto.phoneNumber,
      dto.validationCode,
    );
  }
}
