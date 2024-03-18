import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
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
import { BitrixAuthGuard } from '../auth/jwt/guards/bitrix.guard';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  apiBodyOrgRegisterSchema,
  badRequestOrgRegisterSchema,
  successOrgRegisterSchema,
} from './swagger/register.schema';
import {
  notFoundOrgConfirmOrRejectSchema,
  successOrgConfirmOrRejectSchema,
} from './swagger/confirm-reject.schema';
import {
  badRquestInvalidInnSchema,
  successDadataSchema,
} from './swagger/dadata.schema';

@ApiTags('Organisation')
@Controller('v1/organisation')
export class OrganisationController {
  constructor(
    @Inject(OrganisationService)
    private organisationService: OrganisationService,
  ) {}

  @Post('registration')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register organisation' })
  @ApiBody(apiBodyOrgRegisterSchema)
  @ApiResponse(successOrgRegisterSchema)
  @ApiResponse(badRequestOrgRegisterSchema)
  async createOrg(
    @Body(new CreateOrgValidationPipe()) dto: CreateOrganisationDto,
    @UserDecorator() user: User,
  ) {
    await this.organisationService.create(
      {
        ...dto,
        status: OrgStatus.SENT_TO_MODERATION,
      },
      user,
    );

    return {
      message: OK_MESSAGE,
    };
  }

  @Patch('registration/confirm/:inn')
  @UseGuards(BitrixAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'confirm organisation registration from  bitrix' })
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async confirmRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REGISTRED,
    });

    return { message: OK_MESSAGE };
  }

  @Patch('registration/reject/:inn')
  @UseGuards(BitrixAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Reject organisation registration from  bitrix' })
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async rejectRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REJECTED,
    });

    return { message: OK_MESSAGE };
  }

  @Get('dadata/:inn')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organisation info from dadata by inn' })
  @ApiResponse(successDadataSchema)
  @ApiResponse(badRquestInvalidInnSchema)
  async getOrgInfoFromThirdartyApi(
    @Param('inn', InnValidationPipe) inn: string,
  ) {
    return this.organisationService.getOrgInfoFromDadata(inn);
  }
}
