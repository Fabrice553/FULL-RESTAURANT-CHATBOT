import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../common/dtos/send-message.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * Send a message to the chatbot
   */
  @Post('message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<{
    success: boolean;
    data: { botResponse: string; sessionId: string };
    message: string;
  }> {
    try {
      const result = await this.chatService.handleMessage(
        sendMessageDto.deviceId,
        sendMessageDto.message,
      );

      return {
        success: true,
        data: result,
        message: 'Message processed successfully',
      };
    } catch (error) {
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
  @Get('health')
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
  @Get('info')
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
}