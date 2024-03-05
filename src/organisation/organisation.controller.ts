import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './create.dto';
import { OrgStatus } from './organisation.entity';
import { OK_MESSAGE } from '../messages.constant';
import { InnValidationPipe } from './inn-validation.pipe';
import { Roles } from '../auth/jwt/decorators/roles.decorator';
import { Role } from '../user/roles.enum';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { User as UserDecorator } from '../auth/jwt/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateOrgValidationPipe } from './create-org-validation.pipe';

@Controller('v1/organisation')
export class OrganisationController {
  constructor(
    @Inject(OrganisationService)
    private organisationService: OrganisationService,
  ) {}

  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('registration')
  async createOrg(
    @Body(new CreateOrgValidationPipe()) dto: CreateOrganisationDto,
    @UserDecorator() user: User,
  ) {
    return this.organisationService.create(
      {
        ...dto,
        status: OrgStatus.SENT_TO_MODERATION,
      },
      user,
    );
  }

  @Put('registration/confirm/:inn')
  async confirmRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REGISTRED,
    });

    return { message: OK_MESSAGE };
  }

  @Get('/:inn')
  async getOrgByInn(@Param('inn', InnValidationPipe) inn: string) {
    return this.organisationService.getByInn(inn);
  }

  @Get('dadata/:inn')
  async getOrgInfoFromThirdartyApi(
    @Param('inn', InnValidationPipe) inn: string,
  ) {
    return this.organisationService.getOrgInfoFromDadata(inn);
  }
}
