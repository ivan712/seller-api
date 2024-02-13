import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { TokenInfo } from '../auth/jwt/decorators/token.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@TokenInfo() { phoneNumber }: { phoneNumber: string }) {
    const user = await this.userService.getByPhone(phoneNumber);
    return user.getUserInfo();
  }
}
