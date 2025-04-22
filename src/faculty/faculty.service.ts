import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Prisma, Faculty } from '@prisma/client';

@Injectable()
export class FacultyService {
  private readonly logger = new Logger(FacultyService.name);

  constructor(private prisma: PrismaService) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    try {
      const faculty = await this.prisma.faculty.create({
        data: createFacultyDto,
      });
      return faculty;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(`Faculty with this name or code already exists`);
        }
      }
      this.logger.error(`Failed to create faculty: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Faculty[]> {
    const faculties = (await this.prisma.faculty.findMany({
      include: {
        departments: true,
      },
    })) as Faculty[];
    return faculties;
  }

  async findOne(id: string): Promise<Faculty> {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        departments: true,
      },
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    return faculty;
  }

  async update(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    try {
      // First check if faculty exists
      await this.findOne(id);

      // Then update
      const updatedFaculty = await this.prisma.faculty.update({
        where: { id },
        data: updateFacultyDto,
      });
      return updatedFaculty;
    } catch (error) {
      // If the error is already a NotFoundException, rethrow it
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Handle unique constraint violations
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(`Faculty with this name or code already exists`);
        }
      }

      this.logger.error(`Failed to update faculty ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<Faculty> {
    try {
      // First check if faculty exists
      await this.findOne(id);

      // Check if faculty has departments
      const departments = await this.prisma.department.findMany({
        where: { facultyId: id },
      });

      if (departments.length > 0) {
        throw new Error(
          `Cannot delete faculty with ID ${id} because it has associated departments`,
        );
      }

      // Then delete
      const deletedFaculty = await this.prisma.faculty.delete({
        where: { id },
      });
      return deletedFaculty;
    } catch (error) {
      // If the error is already a NotFoundException, rethrow it
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Failed to delete faculty ${id}: ${error.message}`);
      throw error;
    }
  }
}
