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
const send_message_dto_1 = require("../common/dtos/send-message.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    /**
     * Send a message to the chatbot
     */
    async sendMessage(sendMessageDto) {
        try {
            const result = await this.chatService.handleMessage(sendMessageDto.deviceId, sendMessageDto.message);
            return {
                success: true,
                data: result,
                message: 'Message processed successfully',
            };
        }
        catch (error) {
            return {
                success: false,
                data: { botResponse: 'An error occurred. Please try again.', sessionId: '' },
                message: error.message,
            };
        }
    }
    /**
     * Health check
     */
    health() {
        return {
            status: 'ok',
            message: 'ChatBot API is running',
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Get chatbot info
     */
    info() {
        return {
            name: 'Restaurant ChatBot',
            version: '1.0.0',
            description: 'A full-featured restaurant ordering chatbot',
            features: [
                'Interactive chat interface',
                'Browse restaurant menu',
                'Add items to cart',
                'Paystack payment integration',
                'Order history tracking',
                'View current orders',
                'Cancel orders',
                'Device-based session management',
                'Input validation',
            ],
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "info", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('api/chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map