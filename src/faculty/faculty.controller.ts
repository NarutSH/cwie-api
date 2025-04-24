import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Faculty } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FacultySchema } from './dto/faculty.schema';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  private readonly logger = new Logger(FacultyController.name);

  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin', 'teacher', 'staff')
  // will be remove teacher and staff later
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new faculty' })
  @ApiBody({ type: CreateFacultyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The faculty has been successfully created.',
    type: FacultySchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or faculty with this name/code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource - insufficient permissions.',
  })
  async create(@Body() createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    try {
      const result = await this.facultyService.create(createFacultyDto);
      return result;
    } catch (error) {
      this.logger.error(`Error creating faculty: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to create faculty',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all faculties' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all faculties',
    type: [FacultySchema],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findAll(): Promise<Faculty[]> {
    try {
      const faculties = await this.facultyService.findAll();
      return faculties;
    } catch (error) {
      this.logger.error(`Error retrieving faculties: ${error.message}`);
      throw new HttpException(
        'Failed to retrieve faculties',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a faculty by ID' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The faculty has been found',
    type: FacultySchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findOne(@Param('id') id: string): Promise<Faculty> {
    try {
      const faculty = await this.facultyService.findOne(id);
      return faculty;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      this.logger.error(`Error retrieving faculty: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to retrieve faculty',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a faculty' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiBody({ type: UpdateFacultyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The faculty has been successfully updated.',
    type: FacultySchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or faculty with this name/code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource - insufficient permissions.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    try {
      const updatedFaculty = await this.facultyService.update(
        id,
        updateFacultyDto,
      );
      return updatedFaculty;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      this.logger.error(`Error updating faculty: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to update faculty',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a faculty' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The faculty has been successfully deleted.',
    type: FacultySchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Faculty not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete faculty with associated departments.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource - insufficient permissions.',
  })
  async remove(@Param('id') id: string): Promise<Faculty> {
    try {
      const deletedFaculty = await this.facultyService.remove(id);
      return deletedFaculty;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      this.logger.error(`Error deleting faculty: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to delete faculty',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
