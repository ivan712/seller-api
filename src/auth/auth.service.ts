import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { genSalt, hash } from 'bcryptjs';
import { IPayloadData } from './interfaces/payload-data.interface';
import { IAccessToken } from './interfaces/access-token.interface';
import { JwtService } from '@nestjs/jwt';
import { ICreateUser } from 'src/user/interfaces/create-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  private async generateJwt(payloadData: IPayloadData): Promise<IAccessToken> {
    return {
      accessToken: await this.jwtService.signAsync(payloadData),
    };
  }

  async register(
    registerData: Omit<ICreateUser, 'verificationCode'>,
  ): Promise<IAccessToken> {
    const verificationCode = await this.generateVerificationCode();

    await this.userService.create({ ...registerData, verificationCode });

    const token = await this.generateJwt({
      phoneNumber: registerData.phoneNumber,
    });

    return token;
  }

  async generateVerificationCode() {
    return 1234;
  }

  async createPassword(password: string, phoneNumber: string) {
    //hardcode
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    await this.userService.setPassword(passwordHash, phoneNumber);
  }
}
