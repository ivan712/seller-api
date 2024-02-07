export interface IRefreshTokenRepository {
  add(token: string, userId: string): Promise<void>;
  update(token: string, userId: string): Promise<void>;
  delete(token: string, userId: string): Promise<void>;
  getOne(token: string, userId: string): Promise<string>;
}
