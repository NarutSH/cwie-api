import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ContactListType } from './dto/company.schema';
import { Company, Prisma, PublishStatus } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<Company> {
    // Extract the specific fields we want to handle separately
    const { facultyIds, departmentIds, contactList, ...companyData } =
      createCompanyDto;

    try {
      // Create company with relationships using connect
      const company = await this.prisma.company.create({
        data: {
          name_th: companyData.name_th,
          name_en: companyData.name_en,
          address: companyData.address,
          sub_district: companyData.sub_district,
          district: companyData.district,
          province: companyData.province,
          postcode: companyData.postcode,
          latitude: companyData.latitude,
          longitude: companyData.longitude,
          email: companyData.email,
          phone: companyData.phone,
          status: companyData.status,
          industryId: companyData.industryId,
          createdById: userId,
          // Connect faculties if they exist
          faculties: facultyIds?.length
            ? {
                connect: facultyIds.map((id) => ({ id })),
              }
            : undefined,
          // Connect departments if they exist
          departments: departmentIds?.length
            ? {
                connect: departmentIds.map((id) => ({ id })),
              }
            : undefined,
          // Create contact list items if they exist
          contactList: contactList?.length
            ? {
                create: contactList,
              }
            : undefined,
        },
      });

      if (!company) {
        throw new NotFoundException(`Cannot create company`);
      }

      // Return the complete company
      return company;
    } catch (error) {
      // Log the error to help diagnose the issue
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CompanyWhereUniqueInput;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.company.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        contactList: true,
        faculties: true,
        departments: true,
        industry: true,
        createdBy: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        contactList: true,
        faculties: true,
        departments: true,
        industry: true,
        createdBy: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const { facultyIds, departmentIds, contactList, ...companyData } =
      updateCompanyDto;

    // Check if company exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Update company data
    await this.prisma.$transaction(async (prisma) => {
      // Update basic company data
      const updateData: Prisma.CompanyUpdateInput = { ...companyData };

      // Handle faculty relationships if provided
      if (facultyIds !== undefined) {
        const existingFaculties = await prisma.company.findUnique({
          where: { id },
          select: { faculties: true },
        });

        updateData.faculties = {
          // Disconnect all existing faculties
          disconnect: existingFaculties?.faculties.map((faculty) => ({
            id: faculty.id,
          })),
          // Connect the new faculties
          connect: facultyIds.map((facultyId) => ({ id: facultyId })),
        };
      }

      // Handle department relationships if provided
      if (departmentIds !== undefined) {
        const existingDepartments = await prisma.company.findUnique({
          where: { id },
          select: { departments: true },
        });

        updateData.departments = {
          // Disconnect all existing departments
          disconnect: existingDepartments?.departments.map((department) => ({
            id: department.id,
          })),
          // Connect the new departments
          connect: departmentIds.map((departmentId) => ({ id: departmentId })),
        };
      }

      // Handle contact list if provided
      if (contactList !== undefined) {
        // Delete existing contacts
        await prisma.contactList.deleteMany({
          where: { companyId: id },
        });

        // Create new contacts if any
        if (contactList.length > 0) {
          updateData.contactList = {
            create: contactList,
          };
        }
      }

      // Perform the update
      await prisma.company.update({
        where: { id },
        data: updateData,
      });
    });

    // Return updated company with relations
    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if company exists
    const existingCompany = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Delete company and cascade to relations
    await this.prisma.$transaction(async (prisma) => {
      // Delete contact list entries
      await prisma.contactList.deleteMany({
        where: { companyId: id },
      });

      // Delete the company (relations are handled automatically)
      await prisma.company.delete({
        where: { id },
      });
    });

    return { id, deleted: true };
  }

  // Additional methods to manage company status
  async updateStatus(id: string, status: PublishStatus) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.prisma.company.update({
      where: { id },
      data: { status },
    });
  }

  // Method to add contacts to a company
  async addContact(companyId: string, contactData: ContactListType) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.prisma.contactList.create({
      data: {
        ...contactData,
        companyId,
      },
    });
  }

  // Method to update a contact
  async updateContact(contactId: string, contactData: ContactListType) {
    const contact = await this.prisma.contactList.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    return this.prisma.contactList.update({
      where: { id: contactId },
      data: contactData,
    });
  }

  // Method to remove a contact
  async removeContact(contactId: string) {
    const contact = await this.prisma.contactList.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${contactId} not found`);
    }

    return this.prisma.contactList.delete({
      where: { id: contactId },
    });
  }
}
