import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './create.dto';
import { OrgStatus } from './organisation.entity';
import { OK_MESSAGE } from 'src/messages.constant';
import { InnValidationPipe } from './inn-validation.pipe';

@Controller('v1/organisation')
export class OrganisationController {
  constructor(
    @Inject(OrganisationService)
    private organisationService: OrganisationService,
  ) {}

  @Post('registration')
  async createOrg(@Body() dto: CreateOrganisationDto) {
    return this.organisationService.create({
      ...dto,
      status: OrgStatus.WAIT_REGISTRATION_CONFIRM,
    });
  }

  @Put('registration/confirm/:inn')
  async confirmRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REGISTERED,
    });

    return { message: OK_MESSAGE };
  }

  @Get('/:inn')
  async getOrgByInn(@Param('inn', InnValidationPipe) inn: string) {
    return this.organisationService.getByInn(inn);
  }

  @Get('fromThirdPartyApi/:inn')
  async getOrgInfoFromThirdartyApi(
    @Param('inn', InnValidationPipe) inn: string,
  ) {
    return this.organisationService.getOrgInfoFromThirdartyApi(inn);
  }
}
