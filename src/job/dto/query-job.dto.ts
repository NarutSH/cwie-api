import { ApiProperty } from '@nestjs/swagger';
import { PaymentType, PublishStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryJobDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term for job name (Thai or English)',
    required: false,
    example: 'โปรแกรมเมอร์',
  })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter by company ID',
    required: false,
    example: 'cl1a2b3c4d5e6f7g8h9i0j',
  })
  companyId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter by internship type ID',
    required: false,
    example: 'cl2b3c4d5e6f7g8h9i0j1k',
  })
  internshipTypeId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty({
    description: 'Filter by faculty IDs',
    required: false,
    isArray: true,
    example: ['cl3c4d5e6f7g8h9i0j1k2l'],
  })
  facultyIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty({
    description: 'Filter by department IDs',
    required: false,
    isArray: true,
    example: ['cl4d5e6f7g8h9i0j1k2l3m', 'cl5e6f7g8h9i0j1k2l3m4n'],
  })
  departmentIds?: string[];

  @IsEnum(PublishStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Filter by status',
    required: false,
    enum: PublishStatus,
    example: 'published',
  })
  status?: PublishStatus;

  @IsEnum(PaymentType)
  @IsOptional()
  @ApiProperty({
    description: 'Filter by payment type',
    required: false,
    enum: PaymentType,
    example: 'month',
  })
  paymentType?: PaymentType;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    description: 'Filter by minimum payment',
    required: false,
    example: 15000,
  })
  minPayment?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    description: 'Filter by maximum payment',
    required: false,
    example: 30000,
  })
  maxPayment?: number;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter by start date (on or after)',
    required: false,
    example: '2025-06-01T00:00:00.000Z',
  })
  startDateFrom?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter by end date (on or before)',
    required: false,
    example: '2025-08-31T00:00:00.000Z',
  })
  endDateTo?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'Filter by active status',
    required: false,
    example: true,
  })
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    example: 1,
  })
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'Items per page for pagination',
    required: false,
    default: 10,
    example: 10,
  })
  limit?: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort by field',
    required: false,
    default: 'createdAt',
    example: 'payment',
  })
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort order (asc or desc)',
    required: false,
    default: 'desc',
    example: 'desc',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
