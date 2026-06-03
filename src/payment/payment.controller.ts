import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { SessionService } from '../session/session.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private sessionService: SessionService,
  ) {}

  /**
   * Handle payment callback/verification
   */
  @Get('verify')
  async verifyPayment(@Query('reference') reference: string) {
    try {
      const result = await this.paymentService.checkPaymentStatus(reference);

      return {
        success: result.isPaid,
        message: result.isPaid
          ? '✅ Payment successful! Your order has been confirmed.'
          : '❌ Payment failed. Please try again.',
        status: result.status,
        amount: result.amount,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error verifying payment',
        error: error.message,
      };
    }
  }

  /**
   * Redirect after successful payment
   */
  @Get('success')
  @Redirect('/public/index.html', 301)
  paymentSuccess(@Query('reference') reference: string) {
    // Payment verification happens in the verify endpoint
    // This just redirects back to the chatbot
    return;
  }

  /**
   * Handle payment failure
   */
  @Get('failed')
  paymentFailed() {
    return {
      success: false,
      message: 'Payment was not completed. Please try again.',
    };
  }
}