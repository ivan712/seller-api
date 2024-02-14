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
import {
  INCORRECT_USER_NAME_OR_PASSWORD,
  INCORRECT_USER_NAME_OR_VALIDATION_CODE,
  OK_MESSAGE,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from '../messages.constant';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('v1/auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @Post('preregister')
  @ApiOperation({ summary: 'Get sms code for registration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+7-985-682-91-01',
          description: 'phone number',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sms has been sent to user',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: OK_MESSAGE,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        message: {
          type: 'string',
          example: USER_ALREADY_EXIST,
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async preregister(@Body() dto: PhoneNumberDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');

    await this.authService.preregister({
      ...dto,
    });

    return {
      message: OK_MESSAGE,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+7-985-682-91-01',
          description: 'phone number',
        },
        validationCode: {
          type: 'string',
          example: '0123',
          description: 'validation code',
        },
        name: {
          type: 'string',
          example: 'Ivan',
          description: "user's name",
        },
        role: {
          type: 'string',
          example: 'admin',
          description: "user's role",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register user and get token for password setting',
    schema: {
      type: 'object',
      properties: {
        updateToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODM4MTMzLCJleHAiOjE3MDc4Mzg0MzMsImp0aSI6Ijk2OTkzYmE5ZmE0NmMzYzAzNThlY2RlZGQxIn0.6GIQG-2Dj7LCMFh4O89JacO3UtFTZa5qltiDOpAWYtE',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        message: {
          type: 'string',
          example: USER_ALREADY_EXIST,
        },
      },
    },
  })
  async register(@Body() dto: RegisterDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');

    return this.authService.register(
      { phoneNumber: dto.phoneNumber, name: dto.name, role: dto.role },
      dto.validationCode,
    );
  }

  @UseGuards(JwtUpdateGuard)
  @Put('password/update')
  @ApiOperation({ summary: 'Update password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'Hello123!',
          description: 'password',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been changed or created succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ok',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid jwt update token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'integer',
          example: 401,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Password is not strong enough',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: 400,
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        message: {
          type: 'array',
          items: {
            type: 'string',
            example: 'Password is not strong enough',
          },
        },
      },
    },
  })
  async updatePassword(
    @Body() dto: CreatePasswordDto,
    @TokenInfo()
    { tokenId, phoneNumber }: { tokenId: string; phoneNumber: string },
  ) {
    await this.authService.updatePassword(dto.password, phoneNumber, tokenId);
    return {
      message: OK_MESSAGE,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+7-985-682-91-01',
          description: 'Phone number',
        },
        password: {
          type: 'string',
          example: 'Hello123!',
          description: 'Password',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get access and refresh tokens',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4MzQxMDd9.dRQi5oo_HT7PA87k5mTeUdYfmzGb924bFlzbB7pkyqs',
        },
        refreshToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4NjY1MDcsImp0aSI6IjVlZjcxNTkzNmZmMTE4NWE0ZTc2NTgwNDkxIn0.1vd4KUc6vAHN2apLFycdHhx0AayLY95pVE7uFwfVaVE',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        message: {
          type: 'string',
          example: INCORRECT_USER_NAME_OR_PASSWORD,
        },
      },
    },
  })
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
    return this.authService.login(dto.phoneNumber, dto.password);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh access and refresh tokens',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4MzQxMDd9.dRQi5oo_HT7PA87k5mTeUdYfmzGb924bFlzbB7pkyqs',
        },
        refreshToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODMwNTA3LCJleHAiOjE3MDc4NjY1MDcsImp0aSI6IjVlZjcxNTkzNmZmMTE4NWE0ZTc2NTgwNDkxIn0.1vd4KUc6vAHN2apLFycdHhx0AayLY95pVE7uFwfVaVE',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'integer',
          example: 401,
        },
      },
    },
  })
  @HttpCode(200)
  async refresh(
    @TokenInfo()
    { phoneNumber, tokenId }: { phoneNumber: string; tokenId: string },
  ) {
    return this.authService.refresh(phoneNumber, tokenId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'Logout succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: OK_MESSAGE,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid jwt refresh token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'integer',
          example: 401,
        },
      },
    },
  })
  @HttpCode(200)
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
  @ApiOperation({ summary: 'Get sms code for password changing' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+7-985-682-91-01',
          description: 'Phone number',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sms has been sent to user',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: OK_MESSAGE,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.NOT_FOUND,
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        message: {
          type: 'string',
          example: USER_NOT_FOUND,
        },
      },
    },
  })
  @HttpCode(200)
  async passwordResetRequest(@Body() dto: PhoneNumberDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
    await this.authService.passwordResetRequest(dto.phoneNumber);
    return {
      message: OK_MESSAGE,
    };
  }

  @Post('password/reset/confirm')
  @ApiOperation({
    summary: 'Enter sms code and get token for password changing',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          example: '+7-985-682-91-01',
          description: 'Phone number',
        },
        validationCode: {
          type: 'string',
          example: '0123',
          description: 'Мalidation code',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get token for password setting',
    schema: {
      type: 'object',
      properties: {
        updateToken: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijc5ODU2ODI5MTAxIiwiaWF0IjoxNzA3ODM4MTMzLCJleHAiOjE3MDc4Mzg0MzMsImp0aSI6Ijk2OTkzYmE5ZmE0NmMzYzAzNThlY2RlZGQxIn0.6GIQG-2Dj7LCMFh4O89JacO3UtFTZa5qltiDOpAWYtE',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.BAD_REQUEST,
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        message: {
          type: 'string',
          example: INCORRECT_USER_NAME_OR_VALIDATION_CODE,
        },
      },
    },
  })
  @HttpCode(200)
  async passwordResetConfirm(@Body() dto: ResetPasswordDto) {
    dto.phoneNumber = dto.phoneNumber.replace(/[^!\d]/g, '');
    return this.authService.passwordResetConfirm(
      dto.phoneNumber,
      dto.validationCode,
    );
  }
}
