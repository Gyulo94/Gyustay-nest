import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
