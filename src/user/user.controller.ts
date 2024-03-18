import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { TokenInfo } from '../auth/jwt/decorators/token.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  invalidUserAccessToken,
  successUserInfoSchema,
} from './swagger/user-info.schema';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user and organisation info' })
  @ApiResponse(successUserInfoSchema)
  @ApiResponse(invalidUserAccessToken)
  async getUserInfo(@TokenInfo() { userId }: { userId: string }) {
    const user = await this.userService.getById(userId);
    return user.getUserInfo();
  }
}
