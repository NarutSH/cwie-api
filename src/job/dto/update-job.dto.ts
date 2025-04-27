import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateJobDto } from './create-job.dto';
import { PublishStatus } from '@prisma/client';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsEnum(PublishStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Publication status',
    enum: PublishStatus,
    required: false,
    example: 'published',
  })
  status?: PublishStatus;
}
