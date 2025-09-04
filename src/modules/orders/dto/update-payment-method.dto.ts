import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Payment method ID for the order',
    example: 'uuid-of-payment-method',
  })
  @IsUUID()
  paymentMethodId: string;
}
