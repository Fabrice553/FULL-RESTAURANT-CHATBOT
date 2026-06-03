import { ChatService } from './chat.service';
import { SendMessageDto } from '../common/dtos/send-message.dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    /**
     * Send a message to the chatbot
     */
    sendMessage(sendMessageDto: SendMessageDto): Promise<{
        success: boolean;
        data: {
            botResponse: string;
            sessionId: string;
        };
        message: string;
    }>;
    /**
     * Health check
     */
    health(): {
        status: string;
        message: string;
        timestamp: string;
    };
    /**
     * Get chatbot info
     */
    info(): {
        name: string;
        version: string;
        description: string;
        features: string[];
    };
}
//# sourceMappingURL=chat.controller.d.ts.map