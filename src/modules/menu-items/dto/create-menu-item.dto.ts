import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Margherita Pizza',
    description: 'The name of the menu item',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 9.99,
    description: 'The price of the menu item',
    type: Number,
  })
  @IsNumber()
  price: number;
}
