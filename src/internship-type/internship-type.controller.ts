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
import { InternshipTypeService } from './internship-type.service';
import { CreateInternshipTypeDto } from './dto/create-internship-type.dto';
import { UpdateInternshipTypeDto } from './dto/update-internship-type.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

class QueryInternshipTypeDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}

@ApiTags('internship-types')
@Controller('internship-types')
export class InternshipTypeController {
  constructor(private readonly internshipTypeService: InternshipTypeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new internship type' })
  @ApiResponse({
    status: 201,
    description: 'Internship type created successfully',
  })
  create(@Body() createInternshipTypeDto: CreateInternshipTypeDto) {
    return this.internshipTypeService.create(createInternshipTypeDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all internship types' })
  @ApiResponse({ status: 200, description: 'List of internship types' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(@Query() query: QueryInternshipTypeDto) {
    return this.internshipTypeService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an internship type by ID' })
  @ApiResponse({ status: 200, description: 'Internship type found' })
  @ApiResponse({ status: 404, description: 'Internship type not found' })
  findOne(@Param('id') id: string) {
    return this.internshipTypeService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an internship type' })
  @ApiResponse({
    status: 200,
    description: 'Internship type updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Internship type not found' })
  update(
    @Param('id') id: string,
    @Body() updateInternshipTypeDto: UpdateInternshipTypeDto,
  ) {
    return this.internshipTypeService.update(id, updateInternshipTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an internship type or deactivate if has jobs',
    description:
      'If there are jobs using this internship type, it will be deactivated instead of deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'Internship type deleted or deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Internship type not found' })
  remove(@Param('id') id: string) {
    return this.internshipTypeService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate an internship type' })
  @ApiResponse({
    status: 200,
    description: 'Internship type activated successfully',
  })
  @ApiResponse({ status: 404, description: 'Internship type not found' })
  activate(@Param('id') id: string) {
    return this.internshipTypeService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate an internship type' })
  @ApiResponse({
    status: 200,
    description: 'Internship type deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Internship type not found' })
  deactivate(@Param('id') id: string) {
    return this.internshipTypeService.deactivate(id);
  }
}
