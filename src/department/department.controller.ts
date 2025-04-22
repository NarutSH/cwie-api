import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  HttpStatus,
  HttpException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Department, User } from '@prisma/client';

@Controller('department')
export class DepartmentController {
  private readonly logger = new Logger(DepartmentController.name);

  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin', 'teacher', 'staff')
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Request() req,
  ): Promise<Department> {
    try {
      const result = await this.departmentService.create(
        createDepartmentDto,
        req.user as User,
      );
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error; // Re-throw these exceptions as is
      }
      this.logger.error(`Error creating department: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to create department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(): Promise<Department[]> {
    try {
      const departments = await this.departmentService.findAll();
      return departments;
    } catch (error) {
      this.logger.error(`Error retrieving departments: ${error.message}`);
      throw new HttpException(
        'Failed to retrieve departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('faculty/:facultyId')
  async findByFaculty(
    @Param('facultyId') facultyId: string,
  ): Promise<Department[]> {
    try {
      const departments = await this.departmentService.findByFaculty(facultyId);
      return departments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      this.logger.error(
        `Error retrieving departments by faculty: ${error.message}`,
      );
      throw new HttpException(
        error.message
          ? String(error.message)
          : 'Failed to retrieve departments by faculty',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Department> {
    try {
      const department = await this.departmentService.findOne(id);
      return department;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException as is
      }
      this.logger.error(`Error retrieving department: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to retrieve department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin', 'teacher', 'staff')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Request() req,
  ): Promise<Department> {
    try {
      const updatedDepartment = await this.departmentService.update(
        id,
        updateDepartmentDto,
        req.user as User,
      );
      return updatedDepartment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error; // Re-throw these exceptions as is
      }
      this.logger.error(`Error updating department: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to update department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin', 'teacher', 'staff')
  async remove(@Param('id') id: string, @Request() req): Promise<Department> {
    try {
      const deletedDepartment = await this.departmentService.remove(
        id,
        req.user as User,
      );
      return deletedDepartment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error; // Re-throw these exceptions as is
      }
      this.logger.error(`Error deleting department: ${error.message}`);
      throw new HttpException(
        error.message ? String(error.message) : 'Failed to delete department',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
