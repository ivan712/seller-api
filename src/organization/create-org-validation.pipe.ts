import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { VALIDATION_ERROR } from '../messages.constant';
import { CreateOrganizationDto } from './create.dto';
import { OrgType } from './organization.entity';

@Injectable()
export class CreateOrgValidationPipe implements PipeTransform {
  transform(orgData: Pick<CreateOrganizationDto, 'inn' | 'type' | 'ogrn'>) {
    if (
      (orgData.inn.length === 10 && orgData.type === OrgType.LEGAL) ||
      (orgData.inn.length === 12 && orgData.type === OrgType.INDIVIDUAL) ||
      (orgData.ogrn.length === 13 && orgData.type === OrgType.LEGAL) ||
      (orgData.ogrn.length === 15 && orgData.type === OrgType.INDIVIDUAL)
    ) {
      return orgData;
    }

    throw new BadRequestException(VALIDATION_ERROR);
  }
}
