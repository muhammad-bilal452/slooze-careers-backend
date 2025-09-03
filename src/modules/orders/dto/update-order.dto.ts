import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../enum/order-status.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsUUID()
  paymentMethodId?: string;
}
