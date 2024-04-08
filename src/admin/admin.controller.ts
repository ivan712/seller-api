import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrgStatus } from '../organization/organization.entity';
import {
  apiBodyRejectSchema,
  notFoundOrgConfirmOrRejectSchema,
  successOrgConfirmOrRejectSchema,
} from './swagger/confirm-reject.schema';
import { OrganizationService } from '../organization/organization.service';
import { OK_MESSAGE } from '../messages.constant';
import { SurveyService } from '../survey/survey.service';
import { OrgIdDto } from './dto/org-id.dto';
import { idParamSchema } from './swagger/id-param.schema';
import { ValidationDataPipe } from '../validation.pipe';
import { Roles } from '../auth/jwt/decorators/roles.decorator';
import { Role } from '../user/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt/guards/access-token.guard';
import { RolesGuard } from 'src/auth/jwt/guards/roles.guard';
import { RejectOrgDto } from './dto/reject-org.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('v1/admin')
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@UsePipes(ValidationDataPipe)
export class AdminController {
  constructor(
    private organizationService: OrganizationService,
    private surveyService: SurveyService,
  ) {}

  @Patch('organization/registration/confirm/:id')
  @ApiParam(idParamSchema)
  @ApiOperation({ summary: 'Confirm organization registration' })
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async confirmRegistration(@Param() dto: OrgIdDto) {
    await this.organizationService.updateOrgData(dto.id, {
      status: OrgStatus.REGISTRED,
      adminComment: null,
    });

    return { message: OK_MESSAGE };
  }

  @Patch('organization/registration/reject/:id')
  @ApiParam(idParamSchema)
  @ApiOperation({ summary: 'Reject organization registration' })
  @ApiBody(apiBodyRejectSchema)
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async rejectRegistration(
    @Param() odgIdDto: OrgIdDto,
    @Body() commentDto: RejectOrgDto,
  ) {
    await this.organizationService.updateOrgData(odgIdDto.id, {
      status: OrgStatus.REJECTED,
      adminComment: commentDto.comment,
    });

    return { message: OK_MESSAGE };
  }

  @Get('application/all')
  @ApiOperation({ summary: 'Get all applications' })
  async getAllOrgs() {
    return this.surveyService.getUserAnswersWithOrg();
  }
}
