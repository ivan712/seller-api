import { PrismaService } from 'src/db/prisma.service';
import { ValidationData } from '../validation-data';
import { IValidationDataRepository } from '../interfaces/validation-code-repository.interface';
import { Injectable } from '@nestjs/common';
import { DataType } from '@prisma/client';

@Injectable()
export class ValidationDataRepository implements IValidationDataRepository {
  constructor(private prisma: PrismaService) {}

  async get(
    phoneNumber: string,
    dataType: DataType,
  ): Promise<ValidationData | null> {
    const validationData = await this.prisma.validationData.findUnique({
      where: {
        phoneNumber_dataType: {
          dataType,
          phoneNumber,
        },
      },
    });

    if (!validationData) return null;

    return new ValidationData(validationData);
  }

  async upsertData(validationData: ValidationData): Promise<void> {
    await this.prisma.validationData.upsert({
      where: {
        phoneNumber_dataType: {
          dataType: validationData.getDataType(),
          phoneNumber: validationData.getPhoneNumber(),
        },
      },
      create: {
        phoneNumber: validationData.getPhoneNumber(),
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

  async deleteOne(phoneNumber: string, dataType: DataType) {
    await this.prisma.validationData.delete({
      where: {
        phoneNumber_dataType: {
          dataType,
          phoneNumber,
        },
      },
    });
  }
}
