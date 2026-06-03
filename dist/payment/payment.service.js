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
let PaymentService = class PaymentService {
    constructor() {
        this.paystackSecretKey = 'sk_test_a480070e69c0ee58ddb2f0d2cb77c1e6ddd25769'; // Replace with your key
        this.paystackBaseUrl = 'https://api.paystack.co';
    }
    async initializePayment(email, amount, orderId) {
        try {
            const response = await axios_1.default.post(`${this.paystackBaseUrl}/transaction/initialize`, {
                email,
                amount: Math.round(amount * 100), // Paystack uses kobo (cents)
                metadata: {
                    orderId,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                },
            });
            return {
                success: true,
                data: response.data.data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Payment initialization failed',
                error: error.message,
            };
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await axios_1.default.get(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`,
                },
            });
            return {
                success: response.data.data.status === 'success',
                data: response.data.data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Payment verification failed',
                error: error.message,
            };
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=payment.service.js.map