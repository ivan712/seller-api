import { IsEnum, IsString, Matches } from 'class-validator';
import { OrgType } from './organisation.entity';

export class CreateOrganisationDto {
  @Matches(/^[\d]{10}|[\d]{13}$/)
  inn: string;

  @IsString()
  name: string;

  @IsEnum(OrgType)
  type: OrgType;

  @Matches(/^[\d]{13}$/)
  ogrn: string;

  @IsString()
  legalAddress: string;
}
