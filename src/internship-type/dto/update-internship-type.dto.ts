import { PartialType } from '@nestjs/swagger';
import { CreateInternshipTypeDto } from './create-internship-type.dto';

export class UpdateInternshipTypeDto extends PartialType(
  CreateInternshipTypeDto,
) {}
