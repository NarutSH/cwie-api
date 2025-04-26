import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFacultyDto {
  @ApiProperty({
    example: 'Updated Faculty of Engineering',
    description: 'The updated English name of the faculty',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({
    example: 'คณะวิศวกรรมศาสตร์ (ปรับปรุง)',
    description: 'The updated Thai name of the faculty',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_th?: string;

  @ApiProperty({
    example: 'UENG',
    description: 'The updated code of the faculty',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'Updated description for the faculty',
    description: 'The updated description of the faculty',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the faculty is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
