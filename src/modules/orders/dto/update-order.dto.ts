import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order-status.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
