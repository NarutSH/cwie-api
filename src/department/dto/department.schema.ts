import { ApiProperty } from '@nestjs/swagger';
import { FacultySchema } from '../../faculty/dto/faculty.schema';

export class DepartmentSchema {
  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'Department unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Computer Engineering',
    description: 'English name of the department',
  })
  name_en: string;

  @ApiProperty({
    example: 'วิศวกรรมคอมพิวเตอร์',
    description: 'Thai name of the department',
  })
  name_th: string;

  @ApiProperty({
    example: 'CPE',
    description: 'Short code identifying the department',
  })
  code: string;

  @ApiProperty({
    example: 'Department of Computer Engineering',
    description: 'Description of the department',
  })
  description: string;

  @ApiProperty({
    example: true,
    description: 'Whether the department is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2025-04-22T10:03:50.123Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-22T10:03:50.123Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID of the faculty this department belongs to',
  })
  facultyId: string;

  @ApiProperty({
    type: FacultySchema,
    description: 'Faculty this department belongs to',
  })
  faculty: FacultySchema;
}
