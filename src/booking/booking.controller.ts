import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('all')
  findBookingsAll() {
    return this.bookingService.findBookingsAll();
  }

  @Get(':id')
  findBookingById(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.bookingService.findBookingById(id, user.id);
  }

  @Post()
  @Message(ResponseMessage.BOOKING_CREATE_SUCCESS)
  async createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: Payload,
  ) {
    return this.bookingService.createBooking(dto, user.id);
  }
}
