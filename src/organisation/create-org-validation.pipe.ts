import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { INVALID_INN } from '../messages.constant';
import { CreateOrganisationDto } from './create.dto';
import { OrgType } from './organisation.entity';

@Injectable()
export class CreateOrgValidationPipe implements PipeTransform {
  transform(orgData: Pick<CreateOrganisationDto, 'inn' | 'type'>) {
    if (
      (orgData.inn.length === 10 && orgData.type === OrgType.LEGAL) ||
      (orgData.inn.length === 13 && orgData.type === OrgType.INDIVIDUAL)
    ) {
      return orgData;
    }

    throw new BadRequestException(INVALID_INN);
  }
}
