import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Organisation extends Model {
  @Column
  name: string;

  @Column
  inn: number;
}
