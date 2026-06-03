export declare class PaymentService {
    private paystackSecretKey;
    private paystackBaseUrl;
    initializePayment(email: string, amount: number, orderId: string): Promise<{
        success: boolean;
        data: any;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    verifyPayment(reference: string): Promise<{
        success: boolean;
        data: any;
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map