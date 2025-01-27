import { IValidationData } from './interfaces/validation-data.interface';
import { ValidationData as ValidationDataModel } from '@prisma/client';

export enum DataType {
  validationCode = 'validationCode',
  passwordUpdateToken = 'passwordUpdateToken',
}

export class ValidationData {
  private data: string;
  private expiredAt: Date;
  private userContact: string;
  private dataType: DataType;

  constructor(data: IValidationData | ValidationDataModel) {
    this.userContact = data.userContact;
    this.data = data.data;
    this.expiredAt = data.expiredAt as Date;
    this.dataType = data.dataType as DataType;
  }

  getData(): string {
    return this.data;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  getUserContact(): string {
    return this.userContact;
  }

  getDataType(): DataType {
    return this.dataType;
  }
}
