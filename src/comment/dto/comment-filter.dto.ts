import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CommentFilterDto {
  @IsNumber()
  @IsOptional()
  roomId: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
