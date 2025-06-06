import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, User, Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createDepartmentDto: CreateDepartmentDto,
    user: User,
  ): Promise<Department> {
    try {
      // Check if the faculty exists
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: createDepartmentDto.facultyId },
      });

      if (!faculty) {
        throw new NotFoundException(
          `Faculty with ID ${createDepartmentDto.facultyId} not found`,
        );
      }

      // Check if user has permissions to create department in this faculty
      await this.checkFacultyPermission(user, createDepartmentDto.facultyId);

      const department = await this.prisma.department.create({
        data: {
          name_th: createDepartmentDto.name_th,
          name_en: createDepartmentDto.name_en,
          code: createDepartmentDto.code,
          description: createDepartmentDto.description,
          facultyId: createDepartmentDto.facultyId,
        },
      });
      return department;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error; // Re-throw known exceptions
      }

      // Handle unique constraint violations
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(
            `Department with this name_th, name_en or code already exists`,
          );
        }
      }

      this.logger.error(`Failed to create department: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Department[]> {
    try {
      const departments = await this.prisma.department.findMany({
        include: {
          faculty: true,
          users: true,
        },
      });
      return departments;
    } catch (error) {
      this.logger.error(`Failed to find departments: ${error.message}`);
      throw error;
    }
  }

  async findByFaculty(facultyId: string): Promise<Department[]> {
    try {
      // Check if faculty exists first
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: facultyId },
      });

      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
      }

      const departments = await this.prisma.department.findMany({
        where: { facultyId },
        include: {
          faculty: true,
          users: true,
        },
      });

      return departments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find departments by faculty: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Department> {
    try {
      const department = await this.prisma.department.findUnique({
        where: { id },
        include: {
          faculty: true,
          users: true,
        },
      });

      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      return department;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find department ${id}: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    user: User,
  ): Promise<Department> {
    try {
      // Find department first to check if it exists
      const department = await this.findOne(id);

      // Check if user has permissions to update this department
      if (department && department.facultyId) {
        await this.checkFacultyPermission(user, department.facultyId);
      }

      const updatedDepartment = await this.prisma.department.update({
        where: { id },
        data: {
          name_th: updateDepartmentDto.name_th,
          name_en: updateDepartmentDto.name_en,
          code: updateDepartmentDto.code,
          description: updateDepartmentDto.description,
          isActive: updateDepartmentDto.isActive,
        },
      });
      return updatedDepartment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // Handle unique constraint violations
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(
            `Department with this name_th, name_en or code already exists`,
          );
        }
      }

      this.logger.error(`Failed to update department ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string, user: User): Promise<Department> {
    try {
      // Find department first to check if it exists
      const department = await this.findOne(id);

      // Check if user has permissions to delete this department
      if (department && department.facultyId) {
        await this.checkFacultyPermission(user, department.facultyId);
      }

      // Check if department has associated users using the new implicit many-to-many relationship
      const departmentWithUsers = await this.prisma.department.findUnique({
        where: { id },
        include: {
          users: true,
        },
      });

      if (departmentWithUsers?.users && departmentWithUsers.users.length > 0) {
        throw new Error(
          `Cannot delete department with ID ${id} because it has associated users`,
        );
      }

      // Delete the department
      const deletedDepartment = await this.prisma.department.delete({
        where: { id },
      });
      return deletedDepartment;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(`Failed to remove department ${id}: ${error.message}`);
      throw error;
    }
  }

  // Helper method to check if user has permission to manage departments in the faculty
  private async checkFacultyPermission(
    user: User,
    facultyId: string,
  ): Promise<boolean> {
    try {
      // Admin, superadmin, and staff can do anything
      if (
        user.role === 'admin' ||
        user.role === 'superadmin' ||
        user.role === 'staff'
      ) {
        return true;
      }

      // Check if user is teacher and is associated with this faculty
      if (user.role === 'teacher') {
        // Find if user is associated with any department in this faculty using the implicit many-to-many relationship
        const userWithDepartments = await this.prisma.user.findUnique({
          where: { id: user.id },
          include: {
            departments: {
              where: { facultyId },
            },
          },
        });

        if (!userWithDepartments?.departments?.length) {
          throw new ForbiddenException(
            'You do not have permission to manage departments in this faculty',
          );
        }

        return true;
      }

      throw new ForbiddenException('Insufficient permissions');
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Permission check failed: ${error.message}`);
      throw new ForbiddenException('Error checking permissions');
    }
  }
}
