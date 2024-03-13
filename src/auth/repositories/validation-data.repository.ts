import { PrismaService } from '../../db/prisma.service';
import { ValidationData } from '../validation-data.entity';
import { IValidationDataRepository } from '../interfaces/validation-code-repository.interface';
import { Injectable } from '@nestjs/common';
import { DataType } from '@prisma/client';

@Injectable()
export class ValidationDataRepository implements IValidationDataRepository {
  constructor(private prisma: PrismaService) {}

  async get(
    userContact: string,
    dataType: DataType,
  ): Promise<ValidationData | null> {
    const validationData = await this.prisma.validationData.findUnique({
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

  async upsertData(validationData: ValidationData): Promise<void> {
    await this.prisma.validationData.upsert({
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

  async deleteOne(userContact: string, dataType: DataType) {
    await this.prisma.validationData.delete({
      where: {
        userContact_dataType: {
          dataType,
          userContact,
        },
      },
    });
  }
}
