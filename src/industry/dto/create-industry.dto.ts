import { IndustryType } from './industry.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIndustryDto implements IndustryType {
  @ApiProperty({
    description: 'Industry name in Thai',
    example: 'เทคโนโลยีสารสนเทศ',
  })
  @IsNotEmpty({ message: 'Thai name is required' })
  @IsString({ message: 'Thai name must be a string' })
  name_th: string;

  @ApiProperty({
    description: 'Industry name in English',
    example: 'Information Technology',
  })
  @IsNotEmpty({ message: 'English name is required' })
  @IsString({ message: 'English name must be a string' })
  name_en: string;
}
