import { DataType } from '../validation-data.entity';

export interface IValidationData {
  userContact: string;
  data: string;
  expiredAt: string;
  dataType: DataType;
}
