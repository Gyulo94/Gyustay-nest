import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async findBookingById(id: string, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);

    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: {
          include: {
            category: true,
            images: true,
            comments: true,
          },
        },
      },
    });

    if (!booking) {
      throw new ApiException(ErrorCode.BOOKING_NOT_FOUND);
    }

    if (booking.userId !== userId) {
      throw new ApiException(ErrorCode.FORBIDDEN);
    }

    return booking;
  }

  async findBookingsAll() {
    await this.prisma.booking.findMany({
      include: {
        user: true,
        room: true,
      },
    });
  }

  async createBooking(dto: CreateBookingDto, userId: string) {
    console.log('Creating booking with:', dto);

    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        status: 'SUCCESS',
        ...dto,
      },
    });

    return booking;
  }
}
