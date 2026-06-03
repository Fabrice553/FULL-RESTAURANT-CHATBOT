import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { MenuModule } from './menu/menu.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ChatModule,
    OrderModule,
    PaymentModule,
    MenuModule,
    SessionModule,
  ],
})
export class AppModule {}