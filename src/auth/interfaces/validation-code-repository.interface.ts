import { IDbOptions } from '../../shared/db-options.interface';
import { DataType, ValidationData } from '../validation-data.entity';

export interface IValidationDataRepository {
  get(
    phoneNumber: string,
    dataType: DataType,
    dbOptions?: IDbOptions,
  ): Promise<ValidationData>;
  upsertData(
    validationCode: ValidationData,
    dbOptions?: IDbOptions,
  ): Promise<void>;
  deleteOne(phoneNumber: string, dataType: DataType, dbOptions?: IDbOptions);
}
