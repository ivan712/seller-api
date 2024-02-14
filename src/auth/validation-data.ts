import { IValidationData } from './interfaces/validation-data.interface';

export enum DataType {
  validationCode = 'validationCode',
  passwordUpdateToken = 'passwordUpdateToken',
}

export class ValidationData {
  private data: string;
  private expiredAt: Date;
  private phoneNumber: string;
  private dataType: DataType;

  constructor(data: IValidationData | any) {
    this.phoneNumber = data.phoneNumber;
    this.data = data.data;
    this.expiredAt = data.expiredAt;
    this.dataType = data.dataType;
  }

  getData(): string {
    return this.data;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  getDataType(): DataType {
    return this.dataType;
  }
}
