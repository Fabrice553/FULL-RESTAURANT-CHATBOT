import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ORDER_STATUS } from '../common/constants';

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
@Injectable()
export class OrderService {
  private orders: Map<string, Order> = new Map();
  private ordersBySession: Map<string, Order[]> = new Map();

  /**
   * Create a new order
   */
  createOrder(sessionId: string, items: OrderItem[]): Order {
    const orderId = uuidv4();
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order: Order = {
      orderId,
      sessionId,
      items,
      totalAmount,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(orderId, order);

    // Store order reference by session
    if (!this.ordersBySession.has(sessionId)) {
      this.ordersBySession.set(sessionId, []);
    }
    this.ordersBySession.get(sessionId).push(order);

    return order;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  /**
   * Get all orders for a session
   */
  getOrdersBySession(sessionId: string): Order[] {
    return this.ordersBySession.get(sessionId) || [];
  }

  /**
   * Get current (uncompleted) order for session
   */
  getCurrentOrder(sessionId: string): Order | null {
    const orders = this.getOrdersBySession(sessionId);
    return orders.find(
      (order) =>
        order.status === ORDER_STATUS.PENDING ||
        order.status === ORDER_STATUS.CONFIRMED ||
        order.status === ORDER_STATUS.PREPARING ||
        order.status === ORDER_STATUS.READY,
    ) || null;
  }

  /**
   * Get order history (completed/cancelled orders)
   */
  getOrderHistory(sessionId: string): Order[] {
    const orders = this.getOrdersBySession(sessionId);
    return orders.filter(
      (order) =>
        order.status === ORDER_STATUS.COMPLETED ||
        order.status === ORDER_STATUS.CANCELLED,
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: string): Order | null {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
    }
    return order;
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: string): Order | null {
    const order = this.orders.get(orderId);
    if (
      order &&
      (order.status === ORDER_STATUS.PENDING ||
        order.status === ORDER_STATUS.CONFIRMED)
    ) {
      order.status = ORDER_STATUS.CANCELLED;
      order.updatedAt = new Date();
      return order;
    }
    return null;
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    paymentReference?: string,
  ): Order | null {
    const order = this.orders.get(orderId);
    if (order) {
      order.paymentStatus = paymentStatus;
      if (paymentReference) {
        order.paymentReference = paymentReference;
      }
      order.updatedAt = new Date();
    }
    return order;
  }

  /**
   * Schedule order
   */
  scheduleOrder(orderId: string, scheduledFor: Date): Order | null {
    const order = this.orders.get(orderId);
    if (order) {
      order.scheduledFor = scheduledFor;
      order.updatedAt = new Date();
    }
    return order;
  }

  /**
   * Format order for display
   */
  formatOrderForDisplay(order: Order): string {
    let message = `📦 **Order #${order.orderId.slice(0, 8)}**\n\n`;
    message += `**Items:**\n`;

    order.items.forEach((item, index) => {
      message += `${index + 1}. ${item.itemName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach((opt) => {
          message += `   └─ ${opt}\n`;
        });
      }
    });

    message += `\n**Total:** $${order.totalAmount.toFixed(2)}\n`;
    message += `**Status:** ${order.status}\n`;
    message += `**Created:** ${order.createdAt.toLocaleString()}\n`;

    if (order.scheduledFor) {
      message += `**Scheduled for:** ${order.scheduledFor.toLocaleString()}\n`;
    }

    if (order.paymentStatus) {
      message += `**Payment Status:** ${order.paymentStatus}\n`;
    }

    return message;
  }

  /**
   * Format order history
   */
  formatOrderHistory(orders: Order[]): string {
    if (orders.length === 0) {
      return '📜 **Order History**\n\nNo previous orders found.\n\n0️⃣  - Back to Main Menu';
    }

    let message = `📜 **Order History (${orders.length} orders)**\n\n`;

    orders.forEach((order, index) => {
      message += `${index + 1}️⃣  Order #${order.orderId.slice(0, 8)} - $${order.totalAmount.toFixed(2)} (${order.status})\n   ${order.createdAt.toLocaleString()}\n\n`;
    });

    message += `0️⃣  - Back to Main Menu`;
    return message;
  }
}