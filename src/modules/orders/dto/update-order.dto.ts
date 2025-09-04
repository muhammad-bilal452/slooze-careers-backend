import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../enum/order-status.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Status of the order',
    example: OrderStatus.PLACED,
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment method ID for the order',
    example: 'uuid-of-payment-method',
  })
  @IsUUID()
  paymentMethodId: string;
}
