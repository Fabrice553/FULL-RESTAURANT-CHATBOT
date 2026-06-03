import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { SessionService } from '../session/session.service';
export declare class PaymentController {
    private paymentService;
    private orderService;
    private sessionService;
    constructor(paymentService: PaymentService, orderService: OrderService, sessionService: SessionService);
    /**
     * Handle payment callback/verification
     */
    verifyPayment(reference: string): Promise<{
        success: boolean;
        message: string;
        status: string;
        amount: number;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        status?: undefined;
        amount?: undefined;
    }>;
    /**
     * Redirect after successful payment
     */
    paymentSuccess(reference: string): void;
    /**
     * Handle payment failure
     */
    paymentFailed(): {
        success: boolean;
        message: string;
    };
}
//# sourceMappingURL=payment.controller.d.ts.map