import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user (min 8 characters)',
    example: 'strongPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
