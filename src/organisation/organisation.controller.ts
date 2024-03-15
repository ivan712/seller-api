import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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
import { BitrixAuthGuard } from '../auth/jwt/guards/bitrix.guard';
import {
  // ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  // ApiHeader,
  ApiOperation,
  ApiResponse,
  // ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  apiBodyOrgRegisterSchema,
  successOrgRegisterSchema,
} from './swagger/register.schema';

@ApiTags('Organisation')
@Controller('v1/organisation')
export class OrganisationController {
  constructor(
    @Inject(OrganisationService)
    private organisationService: OrganisationService,
  ) {}

  @Post('registration')
  @ApiOperation({ summary: 'register organisation' })
  @ApiBody(apiBodyOrgRegisterSchema)
  @ApiResponse(successOrgRegisterSchema)
  // @ApiResponse(badRequestPreregisterSchema)
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
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

  // @ApiHeader({
  //   name: 'Authorization',
  //   required: true,
  //   description: 'unique id for correlated logs',
  //   example: '7ea2c7f7-8b46-475d-86f8-7aaaa9e4a35b',
  // })
  @ApiBearerAuth()
  // @ApiBasicAuth('Authorization')
  @Patch('registration/confirm/:inn')
  // @ApiAuth()
  @UseGuards(BitrixAuthGuard)
  async confirmRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REGISTRED,
    });

    return { message: OK_MESSAGE };
  }

  @UseGuards(BitrixAuthGuard)
  @Put('registration/reject/:inn')
  async rejectRegistration(@Param('inn', InnValidationPipe) inn: string) {
    await this.organisationService.updateOrgData(inn, {
      status: OrgStatus.REJECTED,
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
