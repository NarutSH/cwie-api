import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CompanyType, ContactListType } from './company.schema';

export class ContactListDto implements ContactListType {
  @ApiProperty({
    description: 'Contact first name',
    example: 'John',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstname: string;

  @ApiProperty({
    description: 'Contact last name',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastname: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'john.doe@company.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '0891234567',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phone: string;
}

export class CreateCompanyDto implements CompanyType {
  @ApiProperty({
    description: 'Company name in Thai',
    example: 'บริษัท เอบีซี จำกัด',
  })
  @IsNotEmpty({ message: 'Thai name is required' })
  @IsString({ message: 'Thai name must be a string' })
  name_th: string;

  @ApiProperty({
    description: 'Company name in English',
    example: 'ABC Company Limited',
  })
  @IsNotEmpty({ message: 'English name is required' })
  @IsString({ message: 'English name must be a string' })
  name_en: string;

  @ApiProperty({
    description: 'Industry ID that the company belongs to',
    example: 'clruv5qs60000pj8z0pb0g9i1',
  })
  @IsNotEmpty({ message: 'Industry ID is required' })
  @IsString({ message: 'Industry ID must be a string' })
  industryId: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Innovation Road',
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @ApiProperty({
    description: 'Sub-district',
    example: 'แสนสุข',
  })
  @IsNotEmpty({ message: 'Sub-district is required' })
  @IsString({ message: 'Sub-district must be a string' })
  sub_district: string;

  @ApiProperty({
    description: 'District',
    example: 'เมือง',
  })
  @IsNotEmpty({ message: 'District is required' })
  @IsString({ message: 'District must be a string' })
  district: string;

  @ApiProperty({
    description: 'Province',
    example: 'ชลบุรี',
  })
  @IsNotEmpty({ message: 'Province is required' })
  @IsString({ message: 'Province must be a string' })
  province: string;

  @ApiProperty({
    description: 'Postal code',
    example: '20131',
  })
  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString({ message: 'Postal code must be a string' })
  postcode: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate for mapping',
    example: 13.736717,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number | null;

  @ApiPropertyOptional({
    description: 'Longitude coordinate for mapping',
    example: 100.523186,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number | null;

  @ApiPropertyOptional({
    description: 'Company email',
    example: 'contact@abccompany.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Company phone number',
    example: '038-123456',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone?: string | null;

  @ApiProperty({
    description: 'Company status',
    enum: PublishStatus,
    default: 'draft',
    example: 'draft',
  })
  @IsEnum(PublishStatus, { message: 'Invalid status value' })
  @IsOptional()
  status: PublishStatus = 'draft';

  @ApiPropertyOptional({
    description: 'List of faculty IDs associated with the company',
    type: [String],
    example: ['clruv5qs60000pj8z0pb0g9i1', 'clruv5qs60000pj8z0pb0g9i2'],
  })
  @IsOptional()
  @IsArray({ message: 'Faculty IDs must be an array' })
  @IsString({ each: true, message: 'Each faculty ID must be a string' })
  facultyIds?: string[];

  @ApiPropertyOptional({
    description: 'List of department IDs associated with the company',
    type: [String],
    example: ['clruv5qs60000pj8z0pb0g9i3', 'clruv5qs60000pj8z0pb0g9i4'],
  })
  @IsOptional()
  @IsArray({ message: 'Department IDs must be an array' })
  @IsString({ each: true, message: 'Each department ID must be a string' })
  departmentIds?: string[];

  @ApiPropertyOptional({
    description: 'List of company contacts',
    type: [ContactListDto],
    example: [
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@company.com',
        phone: '0891234567',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Contact list must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ContactListDto)
  contactList?: ContactListType[];
}
