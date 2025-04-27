import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    const { faculties, departments, ...jobData } = createJobDto;

    // Create job with relations to faculties and departments
    return await this.prisma.job.create({
      data: {
        ...jobData,
        faculties: {
          connect: faculties.map((faculty) => ({ id: faculty.id })),
        },
        departments: {
          connect: departments.map((department) => ({ id: department.id })),
        },
      },
      include: {
        company: true,
        internshipType: true,
        faculties: true,
        departments: true,
        createdBy: true,
      },
    });
  }

  async findAll(queryDto: QueryJobDto) {
    const {
      search,
      companyId,
      internshipTypeId,
      facultyIds,
      departmentIds,
      status,
      paymentType,
      minPayment,
      maxPayment,
      startDateFrom,
      endDateTo,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const skip = (page - 1) * limit;
    const take = limit;

    // Build where clause based on filters
    const where: Prisma.JobWhereInput = {
      ...(search && {
        OR: [
          { name_th: { contains: search, mode: 'insensitive' } },
          { name_en: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(companyId && { companyId }),
      ...(internshipTypeId && { internshipTypeId }),
      ...(status && { status }),
      ...(paymentType && { payment_type: paymentType }),
      ...(minPayment && { payment: { gte: minPayment } }),
      ...(maxPayment && { payment: { lte: maxPayment } }),
      ...(startDateFrom && { start_date: { gte: new Date(startDateFrom) } }),
      ...(endDateTo && { end_date: { lte: new Date(endDateTo) } }),
      ...(isActive !== undefined && { isActive }),
      ...(facultyIds?.length && {
        faculties: {
          some: {
            id: { in: facultyIds },
          },
        },
      }),
      ...(departmentIds?.length && {
        departments: {
          some: {
            id: { in: departmentIds },
          },
        },
      }),
    };

    // Get total count for pagination
    const totalCount = await this.prisma.job.count({ where });

    // Get jobs with pagination, sorting, and relations
    const jobs = await this.prisma.job.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        company: true,
        internshipType: true,
        faculties: true,
        departments: true,
        createdBy: true,
      },
    });

    return {
      data: jobs,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        internshipType: true,
        faculties: true,
        departments: true,
        createdBy: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const { faculties, departments, ...jobData } = updateJobDto;

    // Check if job exists
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
      include: {
        faculties: true,
        departments: true,
      },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Update job with relations to faculties and departments
    return this.prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        ...(faculties && {
          faculties: {
            disconnect: existingJob.faculties.map((faculty) => ({
              id: faculty.id,
            })),
            connect: faculties.map((faculty) => ({ id: faculty.id })),
          },
        }),
        ...(departments && {
          departments: {
            disconnect: existingJob.departments.map((department) => ({
              id: department.id,
            })),
            connect: departments.map((department) => ({ id: department.id })),
          },
        }),
      },
      include: {
        company: true,
        internshipType: true,
        faculties: true,
        departments: true,
        createdBy: true,
      },
    });
  }

  async remove(id: string) {
    // Check if job exists
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Delete job
    return this.prisma.job.delete({
      where: { id },
    });
  }

  async findByCompany(companyId: string, queryDto: QueryJobDto) {
    // Use findAll but add company filter
    return this.findAll({
      ...queryDto,
      companyId,
    });
  }

  async findByInternshipType(internshipTypeId: string, queryDto: QueryJobDto) {
    // Use findAll but add internship type filter
    return this.findAll({
      ...queryDto,
      internshipTypeId,
    });
  }

  async findByFaculty(facultyId: string, queryDto: QueryJobDto) {
    // Use findAll but add faculty filter
    return this.findAll({
      ...queryDto,
      facultyIds: [facultyId],
    });
  }

  async findByDepartment(departmentId: string, queryDto: QueryJobDto) {
    // Use findAll but add department filter
    return this.findAll({
      ...queryDto,
      departmentIds: [departmentId],
    });
  }

  async updateStatus(
    id: string,
    status: Prisma.EnumPublishStatusFieldUpdateOperationsInput,
  ) {
    // Check if job exists
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Update job status
    return this.prisma.job.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async activateJob(id: string) {
    return await this.prisma.job.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async deactivateJob(id: string) {
    return await this.prisma.job.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
