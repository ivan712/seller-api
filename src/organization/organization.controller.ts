import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './create.dto';
import { OrgStatus } from './organization.entity';
import { OK_MESSAGE } from '../messages.constant';
import { InnValidationPipe } from './inn-validation.pipe';
import { Roles } from '../auth/jwt/decorators/roles.decorator';
import { Role } from '../user/roles.enum';
import { JwtAuthGuard } from '../auth/jwt/guards/access-token.guard';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { User as UserDecorator } from '../auth/jwt/decorators/user.decorator';
import { User } from '../user/user.entity';
import { CreateOrgValidationPipe } from './create-org-validation.pipe';
import {
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
  badRquestInvalidInnSchema,
  successDadataSchema,
} from './swagger/dadata.schema';
import { ValidationDataPipe } from '../validation.pipe';

@ApiTags('Organization')
@Controller('v1/organization')
@UsePipes(ValidationDataPipe)
export class OrganizationController {
  constructor(
    @Inject(OrganizationService)
    private organizationService: OrganizationService,
  ) {}

  @Post('registration')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register organization' })
  @ApiBody(apiBodyOrgRegisterSchema)
  @ApiResponse(successOrgRegisterSchema)
  @ApiResponse(badRequestOrgRegisterSchema)
  async createOrg(
    @Body(CreateOrgValidationPipe) dto: CreateOrganizationDto,
    @UserDecorator() user: User,
  ) {
    await this.organizationService.create(
      {
        ...dto,
        status: OrgStatus.ON_MODERATION,
      },
      user,
    );

    return {
      message: OK_MESSAGE,
    };
  }

  @Get('dadata/:inn')
  @Roles(Role.OWNER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization info from dadata by inn' })
  @ApiResponse(successDadataSchema)
  @ApiResponse(badRquestInvalidInnSchema)
  async getOrgInfoFromThirdartyApi(
    @Param('inn', new InnValidationPipe()) inn: string,
  ) {
    return this.organizationService.getOrgInfoFromDadata(inn);
  }
}
