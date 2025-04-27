import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseJobDto } from './job.schema';
import { IsOptional, IsString } from 'class-validator';

export class CreateJobDto extends OmitType(BaseJobDto, ['status'] as const) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'ID of the user creating the job',
    required: false,
    example: 'cl6f7g8h9i0j1k2l3m4n5o',
  })
  createdById?: string;
}
