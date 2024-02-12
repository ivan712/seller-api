import { DataType } from '../validation-data';

export interface IValidationData {
  phoneNumber: string;
  dataHash: string;
  expiredAt: string;
  dataType: DataType;
}
