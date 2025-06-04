import { IsOptional } from 'class-validator';

export class CancelBookingDto {
  @IsOptional()
  status: 'SUCCESS' | 'CANCELLED' | 'PENDING';
}
