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

@Controller('faculty')
export class FacultyController {
  private readonly logger = new Logger(FacultyController.name);

  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
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
