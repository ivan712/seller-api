import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/access-token.guard';
import { AccessTokenDecorator } from 'src/auth/jwt/access-token.decorator';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(
    @AccessTokenDecorator() { phoneNumber }: { phoneNumber: string },
  ) {
    const user = await this.userService.getByPhone(phoneNumber);
    return user.getUserInfo();
  }
}
