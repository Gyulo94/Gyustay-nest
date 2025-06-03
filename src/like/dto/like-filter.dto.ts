import { IsNumber, IsOptional } from 'class-validator';

export class LikeFilterDto {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  limit: number;
}
