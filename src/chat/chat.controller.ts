import { Controller, Post, Get, Body, Query, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PaymentService } from '../payment/payment.service';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private paymentService: PaymentService,
  ) {}

  @Post('message')
  async sendMessage(
    @Body() body: { deviceId: string; message: string; email?: string },
  ) {
    const { deviceId, message, email } = body;

    if (!deviceId || !message) {
      return {
        success: false,
        message: 'deviceId and message are required',
      };
    }

    const response = this.chatService.handleUserInput(deviceId, message);

    return {
      success: true,
      data: response,
    };
  }

  @Post('payment/initialize')
  async initializePayment(
    @Body() body: { deviceId: string; email: string },
  ) {
    const { deviceId, email } = body;

    const order = this.chatService.getCurrentOrderForPayment(deviceId);

    if (!order) {
      return {
        success: false,
        message: 'No order found',
      };
    }

    const paymentResponse = await this.paymentService.initializePayment(
      email,
      order.totalPrice,
      order.id,
    );

    return {
      success: paymentResponse.success,
      data: paymentResponse.data || null,
      message: paymentResponse.message,
    };
  }

  @Get('payment/verify')
  async verifyPayment(
    @Query('reference') reference: string,
    @Query('deviceId') deviceId: string,
    @Res() res: Response,
  ) {
    const verifyResponse = await this.paymentService.verifyPayment(reference);

    if (verifyResponse.success) {
      const orderId = verifyResponse.data.metadata.orderId;
      this.chatService.updateOrderStatus(deviceId, orderId, 'paid');

      return res.redirect(
        `/chatbot?status=success&orderId=${orderId}&message=Payment successful!`,
      );
    }

    return res.redirect('/chatbot?status=failed&message=Payment verification failed');
  }

  @Post('schedule-order')
  async scheduleOrder(
    @Body() body: { deviceId: string; orderId: string; scheduledDate: string },
  ) {
    const { deviceId, orderId, scheduledDate } = body;

    const result = this.chatService.scheduleOrder(
      deviceId,
      orderId,
      new Date(scheduledDate),
    );

    return {
      success: true,
      message: result,
    };
  }
}