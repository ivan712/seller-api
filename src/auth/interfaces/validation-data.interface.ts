import { DataType } from '../validation-data.entity';

export interface IValidationData {
  phoneNumber: string;
  data: string;
  expiredAt: string;
  dataType: DataType;
}
