export interface IRefreshTokenRepository {
  add(token: string, userId: string): Promise<void>;
  update(token: string, userId: string): Promise<void>;
  deleteOne(token: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
  getOne(token: string, userId: string): Promise<string>;
}
