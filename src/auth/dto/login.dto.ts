import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '56050419',
    description: 'BUU username for LDAP authentication',
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    example: 'yourPassword123',
    description: 'User password (will be converted to UTF-8 encoded hex)',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
