import { CreateIndustryDto } from './create-industry.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateIndustryDto extends PartialType(CreateIndustryDto) {}
