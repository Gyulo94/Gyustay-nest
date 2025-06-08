import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(dto: CreatePaymentDto, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.bookingId,
        userId,
      },
    });
    if (!booking) {
      throw new ApiException(ErrorCode.BOOKING_NOT_FOUND);
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...dto,
      },
    });
    return payment;
  }

  async approvePayment(dto: ApprovePaymentDto, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const {
      orderId,
      paymentKey,
      amount,
      method,
      receiptUrl,
      approvedAt,
      status,
      bookingStatus,
      failureCode,
      failureMessage,
      cardNumber,
      type,
      mId,
      requestedAt,
      cardType,
      checkoutUrl,
    } = dto;

    return this.prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.findUnique({
        where: { orderId },
      });

      if (!payment) {
        throw new ApiException(ErrorCode.PAYMENT_NOT_FOUND);
      }

      const approvedPayment = await prisma.payment.update({
        where: { orderId },
        data: {
          paymentKey,
          method,
          receiptUrl,
          approvedAt,
          amount,
          failureCode,
          failureMessage,
          status,
          cardNumber,
          type,
          mId,
          requestedAt,
          cardType,
          checkoutUrl,
        },
      });

      await prisma.booking.update({
        where: {
          id: payment.bookingId,
          userId,
        },
        data: {
          status: bookingStatus,
        },
      });
      return approvedPayment;
    });
  }

  async findPaymentByOrderId(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        orderId,
      },
    });
    return payment;
  }
}
