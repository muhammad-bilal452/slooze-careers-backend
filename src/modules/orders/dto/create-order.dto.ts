import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Restaurant ID for the order',
    example: 'uuid-of-restaurant',
  })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Array of order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Payment method ID for the order',
    example: 'uuid-of-payment-method',
  })
  @IsUUID()
  paymentMethodId: string;
}
