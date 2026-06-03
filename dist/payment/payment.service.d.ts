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
export declare class PaymentService {
    private readonly paystackUrl;
    private readonly secretKey;
    /**
     * Initialize payment with Paystack
     */
    initializePayment(email: string, amount: number, orderId: string): Promise<PaymentInitResponse>;
    /**
     * Verify payment with Paystack
     */
    verifyPayment(reference: string): Promise<PaymentVerifyResponse>;
    /**
     * Generate payment link
     */
    generatePaymentLink(email: string, amount: number, orderId: string): Promise<{
        authorizationUrl: string;
        reference: string;
    }>;
    /**
     * Verify payment and return status
     */
    checkPaymentStatus(reference: string): Promise<{
        isPaid: boolean;
        amount: number;
        status: string;
    }>;
    /**
     * Format payment link for display
     */
    formatPaymentMessage(authorizationUrl: string, amount: number, orderId: string): string;
}
export {};
//# sourceMappingURL=payment.service.d.ts.map