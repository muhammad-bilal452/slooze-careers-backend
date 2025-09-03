import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../enum/payment-type.enum';

export class CreatePaymentMethodDto {
  @ApiProperty({ enum: PaymentType, description: 'Type of payment' })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    type: String,
    description: 'Payment details (e.g., masked card, UPI ID, PayPal email)',
  })
  @IsString()
  details: string;
}
