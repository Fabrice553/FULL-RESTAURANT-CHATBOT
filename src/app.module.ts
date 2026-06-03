import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, PaymentService],
})
export class AppModule {}