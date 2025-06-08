import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  image: string;

  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  name: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  provider: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  token: string;

  @IsString()
  @Type(() => String)
  password: string;
}
