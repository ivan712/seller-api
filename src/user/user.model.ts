import { Table, Column, Model } from 'sequelize-typescript';
import { Role } from './roles.enum';

@Table
export class UserModel extends Model {
  @Column
  phoneNumber: string;

  @Column
  name: string;

  @Column
  organisationId: number;

  @Column
  verificationCode: string;

  @Column
  codeExpiredAt: Date;

  @Column
  role: Role;

  @Column
  passwordHash: string;

  @Column
  status: string;
}
