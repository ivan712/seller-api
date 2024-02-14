import { DataType, ValidationData } from '../validation-data';

export interface IValidationDataRepository {
  get(phoneNumber: string, dataType: DataType): Promise<ValidationData>;
  upsertData(validationCode: ValidationData): Promise<void>;
  deleteOne(phoneNumber: string, dataType: DataType);
}
