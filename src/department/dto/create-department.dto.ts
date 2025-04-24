import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Computer Engineering',
    description: 'The full name of the department',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'CPE',
    description: 'The short code identifying the department',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 'Department of Computer Engineering',
    description: 'Optional description of the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the faculty that this department belongs to',
  })
  @IsNotEmpty()
  @IsString()
  facultyId: string;
}
