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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const payment_service_1 = require("../payment/payment.service");
let ChatController = class ChatController {
    constructor(chatService, paymentService) {
        this.chatService = chatService;
        this.paymentService = paymentService;
    }
    async sendMessage(body) {
        const { deviceId, message, email } = body;
        if (!deviceId || !message) {
            return {
                success: false,
                message: 'deviceId and message are required',
            };
        }
        const response = this.chatService.handleUserInput(deviceId, message);
        return {
            success: true,
            data: response,
        };
    }
    async initializePayment(body) {
        const { deviceId, email } = body;
        const order = this.chatService.getCurrentOrderForPayment(deviceId);
        if (!order) {
            return {
                success: false,
                message: 'No order found',
            };
        }
        const paymentResponse = await this.paymentService.initializePayment(email, order.totalPrice, order.id);
        return {
            success: paymentResponse.success,
            data: paymentResponse.data || null,
            message: paymentResponse.message,
        };
    }
    async verifyPayment(reference, deviceId, res) {
        const verifyResponse = await this.paymentService.verifyPayment(reference);
        if (verifyResponse.success) {
            const orderId = verifyResponse.data.metadata.orderId;
            this.chatService.updateOrderStatus(deviceId, orderId, 'paid');
            return res.redirect(`/chatbot?status=success&orderId=${orderId}&message=Payment successful!`);
        }
        return res.redirect('/chatbot?status=failed&message=Payment verification failed');
    }
    async scheduleOrder(body) {
        const { deviceId, orderId, scheduledDate } = body;
        const result = this.chatService.scheduleOrder(deviceId, orderId, new Date(scheduledDate));
        return {
            success: true,
            message: result,
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('payment/initialize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "initializePayment", null);
__decorate([
    (0, common_1.Get)('payment/verify'),
    __param(0, (0, common_1.Query)('reference')),
    __param(1, (0, common_1.Query)('deviceId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('schedule-order'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "scheduleOrder", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        payment_service_1.PaymentService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map