"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../common/constants");
/**
 * Payment Service - Handles Paystack integration
 */
let PaymentService = class PaymentService {
    constructor() {
        this.paystackUrl = 'https://api.paystack.co';
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    }
    /**
     * Initialize payment with Paystack
     */
    async initializePayment(email, amount, orderId) {
        try {
            const response = await axios_1.default.post(`${this.paystackUrl}/transaction/initialize`, {
                email,
                amount: Math.round(amount * 100), // Convert to kobo/cents
                reference: `ORDER-${orderId}-${Date.now()}`,
                metadata: {
                    orderId,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Paystack initialization error:', error);
            throw new Error('Failed to initialize payment');
        }
    }
    /**
     * Verify payment with Paystack
     */
    async verifyPayment(reference) {
        try {
            const response = await axios_1.default.get(`${this.paystackUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Paystack verification error:', error);
            throw new Error('Failed to verify payment');
        }
    }
    /**
     * Generate payment link
     */
    async generatePaymentLink(email, amount, orderId) {
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
    async checkPaymentStatus(reference) {
        const response = await this.verifyPayment(reference);
        if (!response.status) {
            return {
                isPaid: false,
                amount: 0,
                status: constants_1.PAYMENT_STATUS.FAILED,
            };
        }
        return {
            isPaid: response.data.status === 'success',
            amount: response.data.amount / 100, // Convert from kobo/cents
            status: response.data.status === 'success' ? constants_1.PAYMENT_STATUS.COMPLETED : constants_1.PAYMENT_STATUS.FAILED,
        };
    }
    /**
     * Format payment link for display
     */
    formatPaymentMessage(authorizationUrl, amount, orderId) {
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=payment.service.js.map