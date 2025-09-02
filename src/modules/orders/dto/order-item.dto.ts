import {
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ description: 'Menu item ID', example: 'uuid-of-menu-item' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantity of this item', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
