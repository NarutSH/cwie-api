import { ApiProperty } from '@nestjs/swagger';
import { PaymentType, PublishStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BaseFacultyDto {
  @IsString()
  @ApiProperty({
    description: 'Faculty ID',
    example: 'cl3c4d5e6f7g8h9i0j1k2l',
  })
  id: string;
}

export class BaseDepartmentDto {
  @IsString()
  @ApiProperty({
    description: 'Department ID',
    example: 'cl4d5e6f7g8h9i0j1k2l3m',
  })
  id: string;
}

export class BaseJobDto {
  @IsString()
  @ApiProperty({
    description: 'Thai name of the job',
    example: 'โปรแกรมเมอร์ฝึกงาน',
  })
  name_th: string;

  @IsString()
  @ApiProperty({
    description: 'English name of the job',
    example: 'Internship Programmer',
  })
  name_en: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Job description',
    required: false,
    example: 'ฝึกงานพัฒนาเว็บแอปพลิเคชันด้วย React และ Node.js',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Job requirements',
    required: false,
    example:
      '- กำลังศึกษาปีที่ 3-4 สาขาวิทยาการคอมพิวเตอร์หรือสาขาที่เกี่ยวข้อง\n- มีความรู้พื้นฐานเกี่ยวกับ JavaScript, HTML, CSS',
  })
  requirement?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Payment amount',
    required: false,
    example: 15000,
  })
  payment?: number;

  @IsEnum(PaymentType)
  @IsOptional()
  @ApiProperty({
    description: 'Payment type',
    enum: PaymentType,
    required: false,
    example: 'month',
  })
  payment_type?: PaymentType;

  @IsDateString()
  @ApiProperty({
    description: 'Start date of the job',
    example: '2025-06-01T00:00:00.000Z',
  })
  start_date: string;

  @IsDateString()
  @ApiProperty({
    description: 'End date of the job',
    example: '2025-07-31T00:00:00.000Z',
  })
  end_date: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    description: 'Number of positions available',
    default: 1,
    example: 2,
  })
  position_count?: number;

  @IsString()
  @ApiProperty({
    description: 'Company ID',
    example: 'cl1a2b3c4d5e6f7g8h9i0j',
  })
  companyId: string;

  @IsString()
  @ApiProperty({
    description: 'Internship type ID',
    example: 'cl2b3c4d5e6f7g8h9i0j1k',
  })
  internshipTypeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseFacultyDto)
  @ApiProperty({
    description: 'List of faculty IDs',
    type: [BaseFacultyDto],
    example: [{ id: 'cl3c4d5e6f7g8h9i0j1k2l' }],
  })
  faculties: BaseFacultyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseDepartmentDto)
  @ApiProperty({
    description: 'List of department IDs',
    type: [BaseDepartmentDto],
    example: [
      { id: 'cl4d5e6f7g8h9i0j1k2l3m' },
      { id: 'cl5e6f7g8h9i0j1k2l3m4n' },
    ],
  })
  departments: BaseDepartmentDto[];

  @IsEnum(PublishStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Publication status',
    enum: PublishStatus,
    default: PublishStatus.draft,
    example: 'draft',
  })
  status?: PublishStatus;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'Whether the job is active',
    default: true,
    example: true,
  })
  isActive?: boolean;
}

export class JobDetailsDto extends BaseJobDto {
  @IsString()
  @ApiProperty({
    description: 'Job ID',
    example: 'cl7g8h9i0j1k2l3m4n5o6p',
  })
  id: string;

  @ApiProperty({
    description: 'Created date',
    example: '2025-04-26T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date',
    example: '2025-04-27T12:34:56.789Z',
  })
  updatedAt: Date;
}
