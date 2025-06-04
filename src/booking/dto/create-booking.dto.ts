import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @Type(() => Number)
  @IsNotEmpty()
  roomId: number;

  @IsNotEmpty()
  @Type(() => Date)
  checkIn: Date;

  @IsNotEmpty()
  @Type(() => Date)
  checkOut: Date;

  @Type(() => Number)
  @IsNotEmpty()
  guestCount: number;

  @Type(() => Number)
  @IsNotEmpty()
  totalAmount: number;

  @Type(() => Number)
  @IsNotEmpty()
  totalDays: number;
}
