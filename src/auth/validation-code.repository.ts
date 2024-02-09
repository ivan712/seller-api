import { PrismaService } from 'src/db/prisma.service';
import { ValidationCode } from './validation-code';
import { IValidationCodeRepository } from './interfaces/validation-code-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationCodeRepository implements IValidationCodeRepository {
  constructor(private prisma: PrismaService) {}

  async get(phoneNumber: string): Promise<ValidationCode | null> {
    const validationCode = await this.prisma.validationCode.findUnique({
      where: { phoneNumber },
    });

    if (!validationCode) return null;

    return new ValidationCode({ pgDoc: validationCode });
  }

  async upsertCode(validationCode: ValidationCode): Promise<void> {
    await this.prisma.validationCode.upsert({
      where: {
        phoneNumber: validationCode.getPhoneNumber(),
      },
      update: {
        codeHash: validationCode.getCodeHash(),
        //hardcode
        expiredAt: String(validationCode.getExpiredAt()),
      },
      create: {
        phoneNumber: validationCode.getPhoneNumber(),
        codeHash: validationCode.getCodeHash(),
        //hardcode
        expiredAt: String(validationCode.getExpiredAt()),
      },
    });
  }
}
