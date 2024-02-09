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
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from './refresh-token.repository';
import {
  INCORRECT_USER_NAME_OR_PASSWORD,
  INVALID_TOKEN,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from 'src/exception-messages.constant';
import { ValidationCode } from './validation-code';
import { ValidationCodeRepository } from './validation-code.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(ValidationCodeRepository)
    private readonly validationCodeRepository: ValidationCodeRepository,
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

  async preregister(registerData: { phoneNumber: string }): Promise<void> {
    const user = await this.userService.getByPhone(registerData.phoneNumber);

    if (user) throw new BadRequestException(USER_ALREADY_EXIST);

    await this.upsertValidationCode(registerData.phoneNumber);
  }

  async upsertValidationCode(phoneNumber: string): Promise<void> {
    let newValidationCode = new ValidationCode();
    newValidationCode = await newValidationCode.generate(phoneNumber);
    await this.validationCodeRepository.upsertCode(newValidationCode);
  }

  async getPasswordUpdateToken(
    code: string,
    phoneNumber: string,
  ): Promise<Pick<ITokens, 'accessToken'>> {
    const validationCode = await this.validationCodeRepository.get(phoneNumber);

    if (!validationCode)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    const isCodeValid = await validationCode.validate(code);

    if (!isCodeValid)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    const accessToken = await this.generatePasswordUpdateJwt({
      phoneNumber,
    });

    return { accessToken };
  }

  async passwordResetRequest(phoneNumber: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    console.log(user);
    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    await this.upsertValidationCode(phoneNumber);
  }

  async passwordResetConfirm(phoneNumber: string, code: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user) throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    return this.getPasswordUpdateToken(code, phoneNumber);
  }

  async register(
    userData: ICreateUser,
    validationCode: string,
  ): Promise<Pick<ITokens, 'accessToken'>> {
    const user = await this.userService.getByPhone(userData.phoneNumber);

    if (user) throw new BadRequestException(USER_ALREADY_EXIST);

    const token = await this.getPasswordUpdateToken(
      validationCode,
      userData.phoneNumber,
    );

    await this.userService.create(userData);

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

  async updatePassword(password: string, phoneNumber: string) {
    //hardcode
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);

    await this.userService.setPassword(passwordHash, phoneNumber);
  }

  async refresh(phoneNumber: string, token: string): Promise<ITokens> {
    const tokenInfo = await this.refreshTokenRepository.getOne(token);

    if (!tokenInfo) throw new ForbiddenException(INVALID_TOKEN);

    const payload = { phoneNumber };
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessJwt(payload),
      this.generateRefreshJwt(payload),
    ]);

    await this.refreshTokenRepository.update(token, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string) {
    const tokenInfo = await this.refreshTokenRepository.getOne(token);

    if (!tokenInfo) throw new BadRequestException(INVALID_TOKEN);

    await this.refreshTokenRepository.deleteOne(token);
  }
}
