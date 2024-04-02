import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/jwt/guards/admin.guard';
import { OrgStatus } from '../organization/organization.entity';
import {
  notFoundOrgConfirmOrRejectSchema,
  successOrgConfirmOrRejectSchema,
} from './swagger/confirm-reject.schema';
import { OrganizationService } from '../organization/organization.service';
import { OK_MESSAGE } from '../messages.constant';
import { SurveyService } from '../survey/survey.service';
import { OrgIdDto } from './dto/org-id.dto';
import { idParamSchema } from './swagger/id-param.schema';

@ApiTags('Admin')
@Controller('v1/admin')
export class AdminController {
  constructor(
    private organizationService: OrganizationService,
    private surveyService: SurveyService,
  ) {}

  @Patch('organization/registration/confirm/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiParam(idParamSchema)
  @ApiOperation({ summary: 'Confirm organization registration' })
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async confirmRegistration(@Param() dto: OrgIdDto) {
    await this.organizationService.updateOrgData(dto.id, {
      status: OrgStatus.REGISTRED,
    });

    return { message: OK_MESSAGE };
  }

  @Patch('organization/registration/reject/:id')
  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiParam(idParamSchema)
  @ApiOperation({ summary: 'Reject organization registration' })
  @ApiResponse(successOrgConfirmOrRejectSchema)
  @ApiResponse(notFoundOrgConfirmOrRejectSchema)
  async rejectRegistration(@Param() dto: OrgIdDto) {
    await this.organizationService.updateOrgData(dto.id, {
      status: OrgStatus.REJECTED,
    });

    return { message: OK_MESSAGE };
  }

  @Get('application/all')
  @UseGuards(AdminAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Get all applications' })
  async getAllOrgs() {
    return this.surveyService.getUserAnswersWithOrg();
  }
}
