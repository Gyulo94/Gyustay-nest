import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BookingFilterDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
