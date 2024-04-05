import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
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
import { ValidationDataPipe } from '../validation.pipe';

@ApiTags('User')
@Controller('v1/user')
@UsePipes(ValidationDataPipe)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user and organization info' })
  @ApiResponse(successUserInfoSchema)
  @ApiResponse(invalidUserAccessToken)
  async getUserInfo(@TokenInfo() { userId }: { userId: string }) {
    const user = await this.userService.getById(userId);
    return user.getUserInfo();
  }
}
