import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipTypeDto } from './dto/create-internship-type.dto';
import { UpdateInternshipTypeDto } from './dto/update-internship-type.dto';

@Injectable()
export class InternshipTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInternshipTypeDto: CreateInternshipTypeDto) {
    return await this.prisma.internshipType.create({
      data: createInternshipTypeDto,
    });
  }

  async findAll(queryParams: { isActive?: boolean } = {}) {
    const { isActive } = queryParams;
    const where = isActive !== undefined ? { isActive } : {};

    return await this.prisma.internshipType.findMany({
      where,
      orderBy: { name_en: 'asc' },
    });
  }

  async findOne(id: string) {
    const internshipType = await this.prisma.internshipType.findUnique({
      where: { id },
      include: {
        jobs: true,
      },
    });

    if (!internshipType) {
      throw new NotFoundException(`Internship type with ID ${id} not found`);
    }

    return internshipType;
  }

  async update(id: string, updateInternshipTypeDto: UpdateInternshipTypeDto) {
    // Check if internship type exists
    const existingInternshipType = await this.prisma.internshipType.findUnique({
      where: { id },
    });

    if (!existingInternshipType) {
      throw new NotFoundException(`Internship type with ID ${id} not found`);
    }

    return this.prisma.internshipType.update({
      where: { id },
      data: updateInternshipTypeDto,
    });
  }

  async remove(id: string) {
    // Check if internship type exists
    const existingInternshipType = await this.prisma.internshipType.findUnique({
      where: { id },
    });

    if (!existingInternshipType) {
      throw new NotFoundException(`Internship type with ID ${id} not found`);
    }

    // Check if there are any jobs using this internship type
    const jobsCount = await this.prisma.job.count({
      where: { internshipTypeId: id },
    });

    if (jobsCount > 0) {
      // If there are jobs using this internship type, just deactivate it
      return this.prisma.internshipType.update({
        where: { id },
        data: { isActive: false },
      });
    }

    // If no jobs are using this internship type, delete it
    return this.prisma.internshipType.delete({
      where: { id },
    });
  }

  async activate(id: string) {
    return await this.prisma.internshipType.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    return await this.prisma.internshipType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
