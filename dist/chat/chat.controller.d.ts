import { ChatService } from './chat.service';
import { PaymentService } from '../payment/payment.service';
import { Response } from 'express';
export declare class ChatController {
    private chatService;
    private paymentService;
    constructor(chatService: ChatService, paymentService: PaymentService);
    sendMessage(body: {
        deviceId: string;
        message: string;
        email?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            message: string;
            nextAction?: string;
        };
        message?: undefined;
    }>;
    initializePayment(body: {
        deviceId: string;
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
    }>;
    verifyPayment(reference: string, deviceId: string, res: Response): Promise<void>;
    scheduleOrder(body: {
        deviceId: string;
        orderId: string;
        scheduledDate: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=chat.controller.d.ts.map