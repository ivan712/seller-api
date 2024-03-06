import { IsEnum, IsString, Matches } from 'class-validator';
import { OrgType } from './organisation.entity';
import {
  INVALID_INN,
  INVALID_OGRN,
  INVALID_ORG_TYPE,
} from 'src/messages.constant';

export class CreateOrganisationDto {
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
