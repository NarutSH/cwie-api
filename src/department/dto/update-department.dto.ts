import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiProperty({
    example: 'Updated Computer Engineering',
    description: 'The updated English name of the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({
    example: 'วิศวกรรมคอมพิวเตอร์ (ปรับปรุง)',
    description: 'The updated Thai name of the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_th?: string;

  @ApiProperty({
    example: 'UCPE',
    description: 'The updated code of the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'Updated description for the Computer Engineering department',
    description: 'The updated description of the department',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the department is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
