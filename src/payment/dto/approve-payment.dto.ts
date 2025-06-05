import { BookingStatus, PaymentStatus, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ApprovePaymentDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  orderId: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  paymentKey: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  method: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  receiptUrl: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  approvedAt: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  requestedAt: string;

  @IsOptional()
  bookingStatus: BookingStatus;

  @IsOptional()
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  @Type(() => String)
  failureCode?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  failureMessage?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  cardNumber: string;

  @IsString()
  @IsOptional()
  type?: PaymentType;

  @IsString()
  @IsOptional()
  @Type(() => String)
  mId?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  cardType?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  checkoutUrl?: string;
}
