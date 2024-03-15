import { PrismaService } from '../../db/prisma.service';
import { ValidationData } from '../validation-data.entity';
import { IValidationDataRepository } from '../interfaces/validation-code-repository.interface';
import { Injectable } from '@nestjs/common';
import { DataType } from '@prisma/client';
import { IDbOptions } from '../../db/db-options.interface';
import { Repository } from 'src/db/repository';

@Injectable()
export class ValidationDataRepository
  extends Repository
  implements IValidationDataRepository
{
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async get(
    userContact: string,
    dataType: DataType,
    dbOptions?: IDbOptions,
  ): Promise<ValidationData | null> {
    const validationData = await this.getClient(
      dbOptions,
    ).validationData.findUnique({
      where: {
        userContact_dataType: {
          dataType,
          userContact,
        },
      },
    });

    if (!validationData) return null;

    return new ValidationData(validationData);
  }

  async upsertData(
    validationData: ValidationData,
    dbOptions?: IDbOptions,
  ): Promise<void> {
    await this.getClient(dbOptions).validationData.upsert({
      where: {
        userContact_dataType: {
          dataType: validationData.getDataType(),
          userContact: validationData.getUserContact(),
        },
      },
      create: {
        userContact: validationData.getUserContact(),
        data: validationData.getData(),
        dataType: validationData.getDataType(),
        expiredAt: validationData.getExpiredAt().toISOString(),
      },
      update: {
        data: validationData.getData(),
        expiredAt: validationData.getExpiredAt().toISOString(),
      },
    });
  }

  async deleteOne(
    userContact: string,
    dataType: DataType,
    dbOptions?: IDbOptions,
  ) {
    await this.getClient(dbOptions).validationData.delete({
      where: {
        userContact_dataType: {
          dataType,
          userContact,
        },
      },
    });
  }
}
