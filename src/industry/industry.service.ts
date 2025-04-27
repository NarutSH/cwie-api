import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustryService {
  constructor(private prisma: PrismaService) {}

  async create(createIndustryDto: CreateIndustryDto) {
    return await this.prisma.industry.create({
      data: createIndustryDto,
    });
  }

  async findAll() {
    return await this.prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { name_en: 'asc' },
    });
  }

  async findOne(id: string) {
    const industry = await this.prisma.industry.findUnique({
      where: { id },
    });

    if (!industry) {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }

    return industry;
  }

  async update(id: string, updateIndustryDto: UpdateIndustryDto) {
    try {
      return await this.prisma.industry.update({
        where: { id },
        data: updateIndustryDto,
      });
    } catch {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.industry.update({
        where: { id },
        data: { isActive: false },
      });
      return { id, deleted: true };
    } catch {
      throw new NotFoundException(`Industry with ID ${id} not found`);
    }
  }
}
