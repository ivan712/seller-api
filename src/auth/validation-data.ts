import { IValidationData } from './interfaces/validation-data.interface';

export enum DataType {
  validationCode = 'validationCode',
  passwordUpdateToken = 'passwordUpdateToken',
}

export class ValidationData {
  private dataHash: string;
  private expiredAt: String;
  private phoneNumber: string;
  private dataType: DataType;

  constructor(data: IValidationData | any) {
    this.phoneNumber = data.phoneNumber;
    this.dataHash = data.dataHash;
    this.expiredAt = data.expiredAt;
    this.dataType = data.dataType;
  }

  getDataHash(): string {
    return this.dataHash;
  }

  getExpiredAt(): String {
    return this.expiredAt;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  getDataType(): DataType {
    return this.dataType;
  }
}
