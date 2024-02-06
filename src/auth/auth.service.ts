import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { genSalt, hash } from 'bcryptjs';
import { IPayloadData } from './interfaces/payload-data.interface';
import { ITokens } from './interfaces/access-token.interface';
import { JwtService } from '@nestjs/jwt';
import { ICreateUser } from 'src/user/interfaces/create-user.interface';
import { UserStatus } from 'src/user/user.status';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private async generateAccessJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('ACCESS_TOKEN_EXPIRE_TIME'),
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async generatePasswordUpdateJwt(
    payloadData: IPayloadData,
  ): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('PASSWORD_UPDATE_TOKEN_EXPIRE'),
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async generateRefreshJwt(payloadData: IPayloadData): Promise<string> {
    return this.jwtService.signAsync(payloadData, {
      expiresIn: Number(
        this.configService.get<number>('REFRESH_TOKEN_EXPIRE_TIME'),
      ),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async preregister(
    registerData: Omit<ICreateUser, 'verificationCode'>,
  ): Promise<void> {
    const verificationCode = await this.generateVerificationCode();

    const user = await this.userService.getByPhone(registerData.phoneNumber);

    if (user && user?.status !== UserStatus.PREREGISTER)
      throw new BadRequestException('user already registred');

    await this.userService.create({
      ...registerData,
      verificationCode,
    });
  }

  async register(
    verificationCode: string,
    phoneNumber: string,
  ): Promise<Pick<ITokens, 'accessToken'>> {
    const user = await this.userService.getByPhone(phoneNumber);
    if (user.status !== UserStatus.PREREGISTER)
      //hardcode
      throw new BadRequestException('user already registred');
    const isCodeValid = await this.checkVerificationCode(
      verificationCode,
      phoneNumber,
    );
    if (!isCodeValid)
      //hardcode
      throw new ForbiddenException('FORBIDDEN');

    await this.userService.confirmRegistration(phoneNumber);

    const accessToken = await this.generatePasswordUpdateJwt({
      phoneNumber,
    });

    return { accessToken };
  }

  private async checkVerificationCode(
    verificationCode: string,
    phoneNumber: string,
  ): Promise<Boolean> {
    const user = await this.userService.getByPhone(phoneNumber);
    if (user.verificationCode !== verificationCode) return false;
    return true;
  }

  async login(phoneNumber: string, password: string): Promise<ITokens> {
    const { passwordHash } = await this.userService.getByPhone(phoneNumber);
    if (!passwordHash)
      //hardcode
      throw new BadRequestException('Incorrect user name or password');

    const isPasswordValid = await compare(password, passwordHash);
    if (!isPasswordValid)
      //hardcode
      throw new BadRequestException('Incorrect user name or password');
    const payload = {
      phoneNumber,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessJwt(payload),
      this.generateRefreshJwt(payload),
    ]);

    await this.userService.updateRefreshToken(refreshToken, phoneNumber);

    return { accessToken, refreshToken };
  }

  private async generateVerificationCode() {
    //hardcode
    return 1234;
  }

  async updatePassword(password: string, phoneNumber: string) {
    //hardcode
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    await this.userService.setPassword(passwordHash, phoneNumber);
  }
}
