import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enum/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Updated full name of the user',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated email address of the user',
    example: 'jane@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Updated password (min 8 characters)',
    minLength: 8,
    example: 'newStrongPassword123',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Enter your coutnry name',
    minLength: 2,
    example: 'India',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiPropertyOptional({
    description: 'Updated role of the user',
    enum: UserRole,
    example: UserRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
