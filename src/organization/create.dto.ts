import { IsEnum, IsString, Matches } from 'class-validator';
import { OrgType } from './organization.entity';
import {
  INVALID_INN,
  INVALID_OGRN,
  INVALID_ORG_TYPE,
} from '../messages.constant';

export class CreateOrganizationDto {
  @Matches(/^[\d]{10}|[\d]{12}$/, { message: INVALID_INN })
  inn: string;

  @IsString()
  name: string;

  @IsEnum(OrgType, { message: INVALID_ORG_TYPE })
  type: OrgType;

  @Matches(/^[\d]{13}$/, { message: INVALID_OGRN })
  ogrn: string;

  @IsString()
  legalAddress: string;
}
