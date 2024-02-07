import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
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
import { RefreshTokenRepository } from './refresh-token.repository';
import {
  INCORRECT_USER_NAME_OR_PASSWORD,
  INVALID_TOKEN,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from 'src/exception-messages.constant';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
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

    if (user) {
      if (user.status !== UserStatus.PREREGISTER)
        throw new BadRequestException(USER_ALREADY_EXIST);

      const newVerificationCode = await this.generateVerificationCode();
      await this.userService.updateVerificationCode(
        String(newVerificationCode),
        registerData.phoneNumber,
      );

      return;
    }

    await this.userService.create({
      ...registerData,
      verificationCode,
    });
  }

  async getPasswordUpdateCode(phoneNumber: string) {
    const newVerificationCode = await this.generateVerificationCode();
    await this.userService.updateVerificationCode(
      String(newVerificationCode),
      phoneNumber,
    );
  }

  async getPasswordUpdateToken(
    verificationCode1: string,
    verificationCode2: string,
    phoneNumber: string,
  ): Promise<Pick<ITokens, 'accessToken'>> {
    if (verificationCode1 !== verificationCode2)
      throw new ForbiddenException(INCORRECT_USER_NAME_OR_PASSWORD);

    const accessToken = await this.generatePasswordUpdateJwt({
      phoneNumber,
    });

    return { accessToken };
  }

  async passwordResetRequest(phoneNumber: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user || user.status !== UserStatus.REGISTER)
      throw new NotFoundException(USER_NOT_FOUND);

    await this.getPasswordUpdateCode(phoneNumber);
  }

  async passwordResetConfirm(phoneNumber: string, code: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user || user.status !== UserStatus.REGISTER)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    return this.getPasswordUpdateToken(
      code,
      user.verificationCode,
      phoneNumber,
    );
  }

  async register(
    verificationCode: string,
    phoneNumber: string,
  ): Promise<Pick<ITokens, 'accessToken'>> {
    const user = await this.userService.getByPhone(phoneNumber);

    if (!user) throw new BadRequestException(USER_NOT_FOUND);

    if (user.status !== UserStatus.PREREGISTER)
      throw new BadRequestException(USER_ALREADY_EXIST);

    const token = await this.getPasswordUpdateToken(
      user.verificationCode,
      verificationCode,
      phoneNumber,
    );

    await this.userService.confirmRegistration(phoneNumber);

    return token;
  }

  async login(phoneNumber: string, password: string): Promise<ITokens> {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user || !user.passwordHash)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);
    const payload = {
      phoneNumber,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessJwt(payload),
      this.generateRefreshJwt(payload),
    ]);

    await this.refreshTokenRepository.add(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  private async generateVerificationCode() {
    //hardcode
    return 1235;
  }

  async updatePassword(password: string, phoneNumber: string) {
    //hardcode
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    await this.userService.setPassword(passwordHash, phoneNumber);
  }

  async refresh(phoneNumber: string, token: string): Promise<ITokens> {
    const user = await this.userService.getByPhone(phoneNumber);
    const tokenInfo = await this.refreshTokenRepository.getOne(token, user.id);

    if (!tokenInfo) throw new ForbiddenException(INVALID_TOKEN);

    const payload = { phoneNumber };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessJwt(payload),
      this.generateRefreshJwt(payload),
    ]);

    await this.refreshTokenRepository.update(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(phoneNumber: string, token: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    const tokenInfo = await this.refreshTokenRepository.getOne(token, user.id);

    if (!tokenInfo) throw new BadRequestException(INVALID_TOKEN);

    await this.refreshTokenRepository.delete(token, user.id);
  }
}
