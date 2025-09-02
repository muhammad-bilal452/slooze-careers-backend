import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Palace',
    description: 'The name of the restaurant',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'india',
    description: 'The country where the user is located',
  })
  @IsString()
  country: string;
}
