import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private paystackSecretKey = 'sk_test_YOUR_PAYSTACK_SECRET_KEY'; // Replace with your key
  private paystackBaseUrl = 'https://api.paystack.co';

  async initializePayment(email: string, amount: number, orderId: string) {
    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Paystack uses kobo (cents)
          metadata: {
            orderId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Payment initialization failed',
        error: error.message,
      };
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      return {
        success: response.data.data.status === 'success',
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      };
    }
  }
}