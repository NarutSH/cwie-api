import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe or user@example.com',
    description: 'Username or email address for login',
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    example: 'StrongP@ss1',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
