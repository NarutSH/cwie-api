import { Module } from '@nestjs/common';
import { InternshipTypeService } from './internship-type.service';
import { InternshipTypeController } from './internship-type.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InternshipTypeController],
  providers: [InternshipTypeService],
  exports: [InternshipTypeService],
})
export class InternshipTypeModule {}
