interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
}
interface CartItem {
    menuItem: MenuItem;
    quantity: number;
}
interface Order {
    id: string;
    items: CartItem[];
    totalPrice: number;
    status: 'pending' | 'paid' | 'completed';
    createdAt: Date;
    scheduledDate?: Date;
}
interface SessionData {
    sessionId: string;
    currentCart: CartItem[];
    orderHistory: Order[];
    currentOrder?: Order;
    createdAt: Date;
}
export declare class ChatService {
    private sessions;
    private menuItems;
    getOrCreateSession(deviceId: string): SessionData;
    handleUserInput(deviceId: string, input: string): {
        message: string;
        nextAction?: string;
    };
    private getMainMenu;
    private getMenuOptions;
    private checkoutOrder;
    private getOrderHistory;
    private getCurrentOrder;
    private cancelOrder;
    private calculateCartTotal;
    private isNumericValid;
    getCurrentOrderForPayment(deviceId: string): Order | null;
    updateOrderStatus(deviceId: string, orderId: string, status: 'pending' | 'paid' | 'completed'): void;
    scheduleOrder(deviceId: string, orderId: string, scheduledDate: Date): string;
}
export {};
//# sourceMappingURL=chat.service.d.ts.map