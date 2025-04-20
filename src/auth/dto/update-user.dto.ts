import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'updated@example.com',
    description: 'The updated email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'newusername',
    description: 'The updated username of the user',
    minLength: 4,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  username?: string;

  @ApiProperty({
    example: 'NewP@ssw0rd',
    description:
      'The updated password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password?: string;

  @ApiProperty({
    example: 'UpdatedFirstName',
    description: 'The updated first name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({
    example: 'UpdatedLastName',
    description: 'The updated last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastname?: string;
}
