import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Industries')
@Controller('industries')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.staff, UserRole.superadmin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new industry',
    description: 'Creates a new industry type. Requires admin privileges.',
  })
  @ApiCreatedResponse({
    description: 'The industry has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
        name_th: { type: 'string', example: 'เทคโนโลยีสารสนเทศ' },
        name_en: { type: 'string', example: 'Information Technology' },
        isActive: { type: 'boolean', example: true },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:00:00Z',
        },
      },
    },
  })
  create(@Body() createIndustryDto: CreateIndustryDto) {
    return this.industryService.create(createIndustryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all industries',
    description: 'Retrieves a list of all active industries.',
  })
  @ApiOkResponse({
    description: 'List of industries retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
          name_th: { type: 'string', example: 'เทคโนโลยีสารสนเทศ' },
          name_en: { type: 'string', example: 'Information Technology' },
          isActive: { type: 'boolean', example: true },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-26T12:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-04-26T12:00:00Z',
          },
        },
      },
    },
  })
  findAll() {
    return this.industryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get industry by ID',
    description: 'Retrieves a specific industry by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Industry ID',
    example: 'clruv5qs60000pj8z0pb0g9i1',
  })
  @ApiOkResponse({
    description: 'Industry retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
        name_th: { type: 'string', example: 'เทคโนโลยีสารสนเทศ' },
        name_en: { type: 'string', example: 'Information Technology' },
        isActive: { type: 'boolean', example: true },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:00:00Z',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.industryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.staff, UserRole.superadmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an industry',
    description: 'Updates an existing industry. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'Industry ID',
    example: 'clruv5qs60000pj8z0pb0g9i1',
  })
  @ApiOkResponse({
    description: 'Industry updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
        name_th: { type: 'string', example: 'เทคโนโลยีสารสนเทศและการสื่อสาร' },
        name_en: {
          type: 'string',
          example: 'Information and Communication Technology',
        },
        isActive: { type: 'boolean', example: true },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:00:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-26T12:30:00Z',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateIndustryDto: UpdateIndustryDto,
  ) {
    return this.industryService.update(id, updateIndustryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.staff, UserRole.superadmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an industry',
    description:
      'Soft deletes an industry by setting isActive to false. Requires admin privileges.',
  })
  @ApiParam({
    name: 'id',
    description: 'Industry ID',
    example: 'clruv5qs60000pj8z0pb0g9i1',
  })
  @ApiOkResponse({
    description: 'Industry deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.industryService.remove(id);
  }
}
