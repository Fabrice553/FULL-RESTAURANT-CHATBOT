"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const order_service_1 = require("../order/order.service");
const session_service_1 = require("../session/session.service");
let PaymentController = class PaymentController {
    constructor(paymentService, orderService, sessionService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.sessionService = sessionService;
    }
    /**
     * Handle payment callback/verification
     */
    async verifyPayment(reference) {
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
        }
        catch (error) {
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
    paymentSuccess(reference) {
        // Payment verification happens in the verify endpoint
        // This just redirects back to the chatbot
        return;
    }
    /**
     * Handle payment failure
     */
    paymentFailed() {
        return {
            success: false,
            message: 'Payment was not completed. Please try again.',
        };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('success'),
    (0, common_1.Redirect)('/public/index.html', 301),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "paymentSuccess", null);
__decorate([
    (0, common_1.Get)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "paymentFailed", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        order_service_1.OrderService,
        session_service_1.SessionService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map