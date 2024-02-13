import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/guards/access-token.guard';
import { TokenInfo } from 'src/auth/jwt/decorators/token.decorator';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@TokenInfo() { phoneNumber }: { phoneNumber: string }) {
    const user = await this.userService.getByPhone(phoneNumber);
    return user.getUserInfo();
  }
}
