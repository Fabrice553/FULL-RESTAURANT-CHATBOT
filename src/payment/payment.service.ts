import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PAYMENT_STATUS } from '../common/constants';

interface PaymentInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    status: string;
    customer: {
      id: number;
      email: string;
    };
  };
}

/**
 * Payment Service - Handles Paystack integration
 */
@Injectable()
export class PaymentService {
  private readonly paystackUrl = 'https://api.paystack.co';
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  /**
   * Initialize payment with Paystack
   */
  async initializePayment(
    email: string,
    amount: number,
    orderId: string,
  ): Promise<PaymentInitResponse> {
    try {
      const response = await axios.post<PaymentInitResponse>(
        `${this.paystackUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert to kobo/cents
          reference: `ORDER-${orderId}-${Date.now()}`,
          metadata: {
            orderId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  /**
   * Verify payment with Paystack
   */
  async verifyPayment(reference: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await axios.get<PaymentVerifyResponse>(
        `${this.paystackUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Generate payment link
   */
  async generatePaymentLink(
    email: string,
    amount: number,
    orderId: string,
  ): Promise<{ authorizationUrl: string; reference: string }> {
    const response = await this.initializePayment(email, amount, orderId);

    if (!response.status) {
      throw new Error('Failed to generate payment link');
    }

    return {
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
    };
  }

  /**
   * Verify payment and return status
   */
  async checkPaymentStatus(reference: string): Promise<{
    isPaid: boolean;
    amount: number;
    status: string;
  }> {
    const response = await this.verifyPayment(reference);

    if (!response.status) {
      return {
        isPaid: false,
        amount: 0,
        status: PAYMENT_STATUS.FAILED,
      };
    }

    return {
      isPaid: response.data.status === 'success',
      amount: response.data.amount / 100, // Convert from kobo/cents
      status: response.data.status === 'success' ? PAYMENT_STATUS.COMPLETED : PAYMENT_STATUS.FAILED,
    };
  }

  /**
   * Format payment link for display
   */
  formatPaymentMessage(authorizationUrl: string, amount: number, orderId: string): string {
    return `
💳 **Payment Required**

Order ID: #${orderId.slice(0, 8)}
Amount: $${(amount / 100).toFixed(2)}

Click the link below to complete payment:
${authorizationUrl}

After payment, you'll be redirected back to the chatbot.
Your order will be confirmed once payment is verified.

⏰ Payment link expires in 30 minutes.
    `.trim();
  }
}