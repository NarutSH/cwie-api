import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COMPANY = 'company',
  ADMIN = 'admin',
}

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    example: 'StrongP@ss1',
    description:
      'The password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 'student',
    description: 'The role of the user',
    enum: UserRole,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
