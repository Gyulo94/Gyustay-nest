import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingFilterDto } from './dto/booking-filter.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
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

  async findBookingsAll(dto: BookingFilterDto, userId: string) {
    const { limit, page } = dto;
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
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
    const totalCount = await this.prisma.booking.count({
      where: { userId },
    });
    return {
      page,
      data: bookings,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
    };
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

  async cancelBooking(id: string, dto: CancelBookingDto, userId: string) {
    const { status } = dto;
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const booking = await this.prisma.booking.findUnique({
      where: { id, userId },
    });
    if (!booking) {
      throw new ApiException(ErrorCode.BOOKING_NOT_FOUND);
    }
    if (booking.status === 'CANCELLED') {
      throw new ApiException(ErrorCode.BOOKING_ALREADY_CANCELLED);
    }
    return this.prisma.booking.update({
      where: { id, userId },
      data: {
        status,
      },
    });
  }
}
