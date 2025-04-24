import { ApiProperty } from '@nestjs/swagger';

export class FacultySchema {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Faculty unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'Faculty of Engineering',
    description: 'Full name of the faculty',
  })
  name: string;

  @ApiProperty({
    example: 'ENG',
    description: 'Short code identifying the faculty',
  })
  code: string;

  @ApiProperty({
    example: 'Faculty responsible for engineering programs',
    description: 'Description of the faculty',
  })
  description: string;

  @ApiProperty({ example: true, description: 'Whether the faculty is active' })
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
    type: [String],
    example: ['Department 1', 'Department 2'],
    description: 'Departments in this faculty',
  })
  departments: string[];
}
