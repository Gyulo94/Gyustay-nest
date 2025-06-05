import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @Type(() => String)
  address: string;

  @IsNotEmpty()
  @Type(() => String)
  bedroomDescription: string;

  @IsNotEmpty()
  @Type(() => String)
  categoryId: string;

  @IsNotEmpty()
  @Type(() => String)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  freeCancel: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasAirConditioner: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasBarbeque: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasFreeLaundry: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasFreeParking: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasMountainsView: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasShampoo: boolean;

  @IsNotEmpty()
  @IsBoolean()
  hasWifi: boolean;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  @Type(() => String)
  lat: string;

  @IsNotEmpty()
  @Type(() => String)
  lng: string;

  @IsNotEmpty()
  @IsBoolean()
  officeSpace: boolean;

  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  selfCheckIn: boolean;

  @IsNotEmpty()
  @Type(() => String)
  title: string;
}
