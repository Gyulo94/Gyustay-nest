import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class CancelBookingDto extends PartialType(CreateBookingDto) {}
