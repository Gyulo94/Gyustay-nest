import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Payload } from 'src/common/utils/type';
import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: Payload,
  ) {
    return this.paymentService.createPayment(dto, user.id);
  }

  @Put()
  async approvePayment(
    @Body() dto: ApprovePaymentDto,
    @CurrentUser() user: Payload,
  ) {
    return this.paymentService.approvePayment(dto, user.id);
  }

  @Get(':orderId')
  findPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.paymentService.findPaymentByOrderId(orderId);
  }
}
