import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class RefreshTokenModel extends Model {
  @Column
  userId: number;

  @Column
  token: string;
}
