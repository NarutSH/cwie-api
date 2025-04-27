import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacultyDto {
  @ApiProperty({
    example: 'Faculty of Engineering',
    description: 'The English name of the faculty',
  })
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty({
    example: 'คณะวิศวกรรมศาสตร์',
    description: 'The Thai name of the faculty',
  })
  @IsNotEmpty()
  @IsString()
  name_th: string;

  @ApiProperty({
    example: 'ENG',
    description: 'The short code identifying the faculty',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: 'Faculty responsible for engineering programs',
    description: 'Optional description of the faculty',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
