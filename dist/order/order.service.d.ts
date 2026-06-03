export interface OrderItem {
    itemId: number;
    itemName: string;
    price: number;
    quantity: number;
    selectedOptions: any[];
}
export interface Order {
    orderId: string;
    sessionId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    scheduledFor?: Date;
    paymentStatus?: string;
    paymentReference?: string;
}
/**
 * Order Service - Manages customer orders
 */
export declare class OrderService {
    private orders;
    private ordersBySession;
    /**
     * Create a new order
     */
    createOrder(sessionId: string, items: OrderItem[]): Order;
    /**
     * Get order by ID
     */
    getOrder(orderId: string): Order | null;
    /**
     * Get all orders for a session
     */
    getOrdersBySession(sessionId: string): Order[];
    /**
     * Get current (uncompleted) order for session
     */
    getCurrentOrder(sessionId: string): Order | null;
    /**
     * Get order history (completed/cancelled orders)
     */
    getOrderHistory(sessionId: string): Order[];
    /**
     * Update order status
     */
    updateOrderStatus(orderId: string, status: string): Order | null;
    /**
     * Cancel order
     */
    cancelOrder(orderId: string): Order | null;
    /**
     * Update payment status
     */
    updatePaymentStatus(orderId: string, paymentStatus: string, paymentReference?: string): Order | null;
    /**
     * Schedule order
     */
    scheduleOrder(orderId: string, scheduledFor: Date): Order | null;
    /**
     * Format order for display
     */
    formatOrderForDisplay(order: Order): string;
    /**
     * Format order history
     */
    formatOrderHistory(orders: Order[]): string;
}
//# sourceMappingURL=order.service.d.ts.map