import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PublishStatus } from '@prisma/client';
import { ContactListType } from './dto/company.schema';
import { Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContactListDto } from './dto/create-company.dto';

// Define custom request interface with user property
interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    role: string;
  };
}

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new company',
    description:
      'Creates a new company with the provided details. All authenticated users can create companies.',
  })
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        name_th: { type: 'string', example: 'บริษัท เอบีซี จำกัด' },
        name_en: { type: 'string', example: 'ABC Company Limited' },
        address: { type: 'string', example: '123 Innovation Road' },
        sub_district: { type: 'string', example: 'แสนสุข' },
        district: { type: 'string', example: 'เมือง' },
        province: { type: 'string', example: 'ชลบุรี' },
        postcode: { type: 'string', example: '20131' },
        latitude: { type: 'number', example: 13.736717 },
        longitude: { type: 'number', example: 100.523186 },
        email: { type: 'string', example: 'contact@abccompany.com' },
        phone: { type: 'string', example: '038-123456' },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'rejected'],
          example: 'draft',
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
          example: '2025-04-26T12:00:00Z',
        },
        industry: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i1' },
            name_th: { type: 'string', example: 'เทคโนโลยีสารสนเทศ' },
            name_en: { type: 'string', example: 'Information Technology' },
          },
        },
        contactList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i6' },
              firstname: { type: 'string', example: 'John' },
              lastname: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@company.com' },
              phone: { type: 'string', example: '0891234567' },
            },
          },
        },
      },
    },
  })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.companyService.create(createCompanyDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all companies',
    description:
      'Retrieves a list of companies with optional filters and pagination.',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip',
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by company status',
    enum: PublishStatus,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term in name or address',
    type: String,
  })
  @ApiQuery({
    name: 'industryId',
    required: false,
    description: 'Filter by industry ID',
    type: String,
  })
  @ApiQuery({
    name: 'facultyId',
    required: false,
    description: 'Filter by faculty ID',
    type: String,
  })
  @ApiQuery({
    name: 'departmentId',
    required: false,
    description: 'Filter by department ID',
    type: String,
  })
  @ApiOkResponse({
    description: 'List of companies retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
          name_th: { type: 'string', example: 'บริษัท เอบีซี จำกัด' },
          name_en: { type: 'string', example: 'ABC Company Limited' },
          address: { type: 'string', example: '123 Innovation Road' },
          province: { type: 'string', example: 'ชลบุรี' },
          status: {
            type: 'string',
            enum: ['draft', 'published', 'rejected'],
            example: 'published',
          },
          industry: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name_th: { type: 'string' },
              name_en: { type: 'string' },
            },
          },
        },
      },
    },
  })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: PublishStatus,
    @Query('search') search?: string,
    @Query('industryId') industryId?: string,
    @Query('facultyId') facultyId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    const filters: {
      skip?: number;
      take?: number;
      where: Prisma.CompanyWhereInput;
      orderBy?: Prisma.CompanyOrderByWithRelationInput;
    } = {
      where: {
        isActive: true,
      },
    };

    // Apply status filter
    if (status) {
      filters.where.status = status;
    }

    // Apply search filter
    if (search) {
      filters.where.OR = [
        { name_th: { contains: search, mode: 'insensitive' } },
        { name_en: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { province: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Apply industry filter
    if (industryId) {
      filters.where.industryId = industryId;
    }

    // Apply faculty filter
    if (facultyId) {
      filters.where.faculties = {
        some: {
          id: facultyId,
        },
      };
    }

    // Apply department filter
    if (departmentId) {
      filters.where.departments = {
        some: {
          id: departmentId,
        },
      };
    }

    // Apply pagination
    if (skip) {
      filters.skip = Number(skip);
    }

    if (take) {
      filters.take = Number(take);
    }

    // Apply default ordering
    filters.orderBy = { createdAt: 'desc' };

    return this.companyService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get company by ID',
    description:
      'Retrieves a specific company by its ID with all related data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    example: 'clruv5qs60000pj8z0pb0g9i5',
  })
  @ApiOkResponse({
    description: 'Company retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        name_th: { type: 'string', example: 'บริษัท เอบีซี จำกัด' },
        name_en: { type: 'string', example: 'ABC Company Limited' },
        address: { type: 'string', example: '123 Innovation Road' },
        sub_district: { type: 'string', example: 'แสนสุข' },
        district: { type: 'string', example: 'เมือง' },
        province: { type: 'string', example: 'ชลบุรี' },
        postcode: { type: 'string', example: '20131' },
        latitude: { type: 'number', example: 13.736717 },
        longitude: { type: 'number', example: 100.523186 },
        email: { type: 'string', example: 'contact@abccompany.com' },
        phone: { type: 'string', example: '038-123456' },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'rejected'],
          example: 'published',
        },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        // Include other related entities
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a company',
    description: 'Updates an existing company with the provided details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    example: 'clruv5qs60000pj8z0pb0g9i5',
  })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiOkResponse({
    description: 'Company updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        name_th: {
          type: 'string',
          example: 'บริษัท เอบีซี อินเตอร์เนชันแนล จำกัด',
        },
        name_en: {
          type: 'string',
          example: 'ABC International Company Limited',
        },
        // Include updated fields
      },
    },
  })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a company',
    description: 'Deletes an existing company and all its related data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    example: 'clruv5qs60000pj8z0pb0g9i5',
  })
  @ApiOkResponse({
    description: 'Company deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update company status',
    description:
      'Updates the status of an existing company (draft, published, rejected).',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    example: 'clruv5qs60000pj8z0pb0g9i5',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'published', 'rejected'],
          example: 'published',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Company status updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        status: {
          type: 'string',
          enum: ['draft', 'published', 'rejected'],
          example: 'published',
        },
      },
    },
  })
  updateStatus(@Param('id') id: string, @Body('status') status: PublishStatus) {
    return this.companyService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/contacts')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add contact to company',
    description: 'Adds a new contact to an existing company.',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
    example: 'clruv5qs60000pj8z0pb0g9i5',
  })
  @ApiBody({ type: ContactListDto })
  @ApiCreatedResponse({
    description: 'Contact added successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i6' },
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@company.com' },
        phone: { type: 'string', example: '0891234567' },
        companyId: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i5' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  addContact(@Param('id') id: string, @Body() contactData: ContactListType) {
    return this.companyService.addContact(id, contactData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('contacts/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update company contact',
    description: 'Updates an existing contact for a company.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    example: 'clruv5qs60000pj8z0pb0g9i6',
  })
  @ApiBody({ type: ContactListDto })
  @ApiOkResponse({
    description: 'Contact updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i6' },
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Smith' }, // Updated lastname
        email: { type: 'string', example: 'john.smith@company.com' }, // Updated email
        phone: { type: 'string', example: '0891234567' },
      },
    },
  })
  updateContact(@Param('id') id: string, @Body() contactData: ContactListType) {
    return this.companyService.updateContact(id, contactData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('contacts/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete company contact',
    description: 'Deletes an existing contact from a company.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    example: 'clruv5qs60000pj8z0pb0g9i6',
  })
  @ApiOkResponse({
    description: 'Contact deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clruv5qs60000pj8z0pb0g9i6' },
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Smith' },
        email: { type: 'string', example: 'john.smith@company.com' },
        phone: { type: 'string', example: '0891234567' },
      },
    },
  })
  removeContact(@Param('id') id: string) {
    return this.companyService.removeContact(id);
  }
}
