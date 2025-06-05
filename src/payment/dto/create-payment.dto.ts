import { PaymentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @Type(() => String)
  bookingId: string;

  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  status: PaymentStatus;

  @IsNotEmpty()
  @Type(() => String)
  orderId: string;

  @IsNotEmpty()
  @Type(() => String)
  orderName: string;
}
