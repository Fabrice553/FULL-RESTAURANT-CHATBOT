import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SessionModule } from '../session/session.module';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [SessionModule, MenuModule, OrderModule, PaymentModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}