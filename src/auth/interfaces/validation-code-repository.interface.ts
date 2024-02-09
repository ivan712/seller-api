import { ValidationCode } from '../validation-code';

export interface IValidationCodeRepository {
  get(phoneNumber: string): Promise<ValidationCode>;
  upsertCode(validationCode: ValidationCode): Promise<void>;
}
