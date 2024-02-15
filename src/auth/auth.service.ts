import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ITokens } from './interfaces/access-token.interface';
import { ICreateUser } from 'src/user/interfaces/create-user.interface';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import {
  INCORRECT_USER_NAME_OR_PASSWORD,
  INCORRECT_USER_NAME_OR_VALIDATION_CODE,
  INVALID_TOKEN,
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
} from '../messages.constant';
import { DataType, ValidationData } from './validation-data';
import { ValidationDataRepository } from './repositories/validation-data.repository';
import { JwtTokensService } from './jwt/jwt-token.service';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private verificationCodeLength;
  private verificationCodeExpireAt;
  private passwordUpdateTokenExpireAt;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(ValidationDataRepository)
    private readonly validationDataRepository: ValidationDataRepository,
    @Inject(JwtTokensService)
    private readonly jwtTokensService: JwtTokensService,
    @Inject(CryptoService) private readonly cryptoService: CryptoService,
  ) {
    this.verificationCodeLength = Number(
      this.configService.get('VERIFICATION_CODE_LENGTH'),
    );
    this.verificationCodeExpireAt = this.configService.get(
      'VERIFICATION_CODE_EXPIRES_AT',
    );
    this.passwordUpdateTokenExpireAt = this.configService.get(
      'DATA_UPDATE_TOKEN_EXPIRES_AT',
    );
  }

  async preregister(registerData: { phoneNumber: string }): Promise<void> {
    const user = await this.userService.getByPhone(registerData.phoneNumber);

    if (user) throw new BadRequestException(USER_ALREADY_EXIST);

    await this.upsertValidationCode(registerData.phoneNumber);

    return;
  }

  async upsertValidationCode(phoneNumber: string): Promise<void> {
    const randomNumber = await this.cryptoService.generateRandomInt();
    const data = String(randomNumber).padStart(
      this.verificationCodeLength,
      '0',
    );
    console.log('code', data);
    const dataHash = await this.cryptoService.createDataHash(data);
    const dataType = DataType.validationCode;
    const validationData = new ValidationData({
      data: dataHash,
      expiredAt: new Date(
        new Date().getTime() + this.verificationCodeExpireAt * 1000,
      ),
      dataType,
      phoneNumber,
    });
    return this.validationDataRepository.upsertData(validationData);
  }

  async generatePasswordUpdateToken(
    code: string,
    phoneNumber: string,
  ): Promise<{ updateToken: string }> {
    const validationCode = await this.validationDataRepository.get(
      phoneNumber,
      DataType.validationCode,
    );

    if (!validationCode)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_VALIDATION_CODE);

    const isNotCodeExpired = new Date() <= validationCode.getExpiredAt();
    if (!isNotCodeExpired)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_VALIDATION_CODE);

    const isCodeValid = await this.cryptoService.validateData(
      code,
      validationCode.getData(),
    );
    if (!isCodeValid)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    await this.validationDataRepository.deleteOne(
      phoneNumber,
      DataType.validationCode,
    );

    const updateToken = await this.jwtTokensService.generateUpdateDataJwt({
      phoneNumber,
    });

    await this.validationDataRepository.upsertData(
      new ValidationData({
        phoneNumber,
        expiredAt: new Date(
          new Date().getTime() + this.passwordUpdateTokenExpireAt * 1000,
        ),
        dataType: DataType.passwordUpdateToken,
        data: updateToken.jwtid,
      }),
    );

    return { updateToken: updateToken.updateJwt };
  }

  async passwordResetRequest(phoneNumber: string) {
    const user = await this.userService.getByPhone(phoneNumber);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    await this.upsertValidationCode(phoneNumber);
  }

  async passwordResetConfirm(phoneNumber: string, code: string) {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user) throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    return this.generatePasswordUpdateToken(code, phoneNumber);
  }

  async register(
    userData: ICreateUser,
    validationCode: string,
  ): Promise<{ updateToken: string }> {
    const user = await this.userService.getByPhone(userData.phoneNumber);

    if (user) throw new BadRequestException(USER_ALREADY_EXIST);

    const updateToken = await this.generatePasswordUpdateToken(
      validationCode,
      userData.phoneNumber,
    );

    await this.userService.create(userData);

    return updateToken;
  }

  async login(phoneNumber: string, password: string): Promise<ITokens> {
    const user = await this.userService.getByPhone(phoneNumber);
    if (!user || !user.passwordHash)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);

    const isPasswordValid = await this.cryptoService.validateData(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new BadRequestException(INCORRECT_USER_NAME_OR_PASSWORD);
    const payload = {
      phoneNumber,
    };

    const tokensAmount = await this.refreshTokenRepository.count(user.id);
    if (tokensAmount === 5)
      await this.refreshTokenRepository.deleteAll(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokensService.generateAccessJwt(payload),
      this.jwtTokensService.generateRefreshJwt(payload),
    ]);

    await this.refreshTokenRepository.add(refreshToken.jwtid, user.id);

    return { accessToken, refreshToken: refreshToken.refreshJwt };
  }

  async updatePassword(
    password: string,
    phoneNumber: string,
    tokenId: string,
  ): Promise<void> {
    const updateTokenId = await this.validationDataRepository.get(
      phoneNumber,
      DataType.passwordUpdateToken,
    );

    if (!updateTokenId || updateTokenId.getData() !== tokenId)
      throw new ForbiddenException(INVALID_TOKEN);

    await this.validationDataRepository.deleteOne(
      phoneNumber,
      DataType.passwordUpdateToken,
    );

    const passwordHash = await this.cryptoService.createDataHash(password);

    await this.userService.setPassword(passwordHash, phoneNumber);
  }

  async refresh(phoneNumber: string, tokenId: string): Promise<ITokens> {
    const tokenInfo = await this.refreshTokenRepository.getOne(tokenId);

    if (!tokenInfo) throw new ForbiddenException(INVALID_TOKEN);

    const payload = { phoneNumber };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokensService.generateAccessJwt(payload),
      this.jwtTokensService.generateRefreshJwt(payload),
    ]);

    await this.refreshTokenRepository.update(tokenId, refreshToken.jwtid);

    return {
      accessToken,
      refreshToken: refreshToken.refreshJwt,
    };
  }

  async logout(tokenId: string) {
    const tokenInfo = await this.refreshTokenRepository.getOne(tokenId);

    if (!tokenInfo) throw new BadRequestException(INVALID_TOKEN);

    await this.refreshTokenRepository.deleteOne(tokenId);
  }
}
