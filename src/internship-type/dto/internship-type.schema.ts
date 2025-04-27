import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class BaseInternshipTypeDto {
  @IsString()
  @ApiProperty({ description: 'Thai name of the internship type' })
  name_th: string;

  @IsString()
  @ApiProperty({ description: 'English name of the internship type' })
  name_en: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'Whether the internship type is active',
    default: true,
  })
  isActive?: boolean;
}

export class InternshipTypeDetailsDto extends BaseInternshipTypeDto {
  @IsString()
  @ApiProperty({ description: 'Internship type ID' })
  id: string;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;
}
