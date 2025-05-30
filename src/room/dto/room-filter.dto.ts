import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomFilterDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
