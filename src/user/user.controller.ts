import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { TokenInfo } from '../auth/jwt/decorators/token.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('v1/user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User info',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Ivan',
        },
        phoneNumber: {
          type: 'string',
          example: '79856829101',
        },
        role: {
          type: 'string',
          example: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid jwt access token',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: HttpStatus.UNAUTHORIZED,
        },
        message: {
          type: 'string',
          example: 'Unauthorizid',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@TokenInfo() { phoneNumber }: { phoneNumber: string }) {
    const user = await this.userService.getByPhone(phoneNumber);
    return user.getUserInfo();
  }
}
