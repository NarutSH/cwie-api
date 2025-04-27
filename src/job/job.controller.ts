import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryJobDto } from './dto/query-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PublishStatus } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs with filters and pagination' })
  @ApiResponse({ status: 200, description: 'List of jobs' })
  findAll(@Query() queryDto: QueryJobDto) {
    return this.jobService.findAll(queryDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a job by ID' })
  @ApiResponse({ status: 200, description: 'Job found' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }

  @Get('company/:companyId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs by company ID' })
  @ApiResponse({ status: 200, description: 'List of jobs for the company' })
  findByCompany(
    @Param('companyId') companyId: string,
    @Query() queryDto: QueryJobDto,
  ) {
    return this.jobService.findByCompany(companyId, queryDto);
  }

  @Get('internship-type/:internshipTypeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs by internship type ID' })
  @ApiResponse({
    status: 200,
    description: 'List of jobs for the internship type',
  })
  findByInternshipType(
    @Param('internshipTypeId') internshipTypeId: string,
    @Query() queryDto: QueryJobDto,
  ) {
    return this.jobService.findByInternshipType(internshipTypeId, queryDto);
  }

  @Get('faculty/:facultyId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs by faculty ID' })
  @ApiResponse({ status: 200, description: 'List of jobs for the faculty' })
  findByFaculty(
    @Param('facultyId') facultyId: string,
    @Query() queryDto: QueryJobDto,
  ) {
    return this.jobService.findByFaculty(facultyId, queryDto);
  }

  @Get('department/:departmentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs by department ID' })
  @ApiResponse({ status: 200, description: 'List of jobs for the department' })
  findByDepartment(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryJobDto,
  ) {
    return this.jobService.findByDepartment(departmentId, queryDto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a job' })
  @ApiResponse({ status: 200, description: 'Job published successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  publish(@Param('id') id: string) {
    return this.jobService.updateStatus(id, { set: PublishStatus.published });
  }

  @Patch(':id/draft')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set job as draft' })
  @ApiResponse({ status: 200, description: 'Job set as draft successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  setDraft(@Param('id') id: string) {
    return this.jobService.updateStatus(id, { set: PublishStatus.draft });
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a job' })
  @ApiResponse({ status: 200, description: 'Job rejected successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  reject(@Param('id') id: string) {
    return this.jobService.updateStatus(id, { set: PublishStatus.rejected });
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a job' })
  @ApiResponse({ status: 200, description: 'Job activated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  activate(@Param('id') id: string) {
    return this.jobService.activateJob(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.company, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a job' })
  @ApiResponse({ status: 200, description: 'Job deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  deactivate(@Param('id') id: string) {
    return this.jobService.deactivateJob(id);
  }
}
