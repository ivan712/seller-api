import { DataType } from '../validation-data';

export interface IValidationData {
  phoneNumber: string;
  data: string;
  expiredAt: string;
  dataType: DataType;
}
