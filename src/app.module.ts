import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { CompanyModule } from './company/company.module';
import { IndustryModule } from './industry/industry.module';
import { JobModule } from './job/job.module';
import { InternshipTypeModule } from './internship-type/internship-type.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
    }),

    // Rate limiting to protect against brute force attacks
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    // Custom modules
    PrismaModule,
    AuthModule,
    UserModule,
    FacultyModule,
    DepartmentModule,
    CompanyModule,
    IndustryModule,
    JobModule,
    InternshipTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
