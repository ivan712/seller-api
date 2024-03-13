import { PrismaService } from '../db/prisma.service';
import { IDbOptions } from './db-options.interface';

export abstract class Repository {
  constructor(protected prisma: PrismaService) {}

  protected getClient(
    dbOptions?: IDbOptions,
  ): PrismaService | IDbOptions['trxn'] {
    const trxn = dbOptions?.trxn;
    return trxn ? trxn : this.prisma;
  }
}
