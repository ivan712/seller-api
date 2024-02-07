import { InjectModel } from '@nestjs/sequelize';
import { IRefreshTokenRepository } from './interfaces/refresh-token-repository.interface';
import { RefreshTokenModel } from './refresh-token.model';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenModel)
    private readonly refreshTokenModel: typeof RefreshTokenModel,
  ) {}

  async add(token: string, userId: string): Promise<void> {
    await this.refreshTokenModel.create({ token, userId });
  }

  async update(token: string, userId: string): Promise<void> {
    await this.refreshTokenModel.update({ token }, { where: { userId } });
  }

  async delete(token: string, userId: string): Promise<void> {
    await this.refreshTokenModel.destroy({
      where: {
        token,
        userId,
      },
    });
  }

  async getOne(token: string, userId: string): Promise<string | null> {
    const tokenInfo = await this.refreshTokenModel.findOne({
      where: { token, userId },
    });
    if (!tokenInfo) return null;

    return tokenInfo.token;
  }
}
