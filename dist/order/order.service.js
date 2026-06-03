"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const constants_1 = require("../common/constants");
/**
 * Order Service - Manages customer orders
 */
let OrderService = class OrderService {
    constructor() {
        this.orders = new Map();
        this.ordersBySession = new Map();
    }
    /**
     * Create a new order
     */
    createOrder(sessionId, items) {
        const orderId = (0, uuid_1.v4)();
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = {
            orderId,
            sessionId,
            items,
            totalAmount,
            status: constants_1.ORDER_STATUS.PENDING,
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
    getOrder(orderId) {
        return this.orders.get(orderId) || null;
    }
    /**
     * Get all orders for a session
     */
    getOrdersBySession(sessionId) {
        return this.ordersBySession.get(sessionId) || [];
    }
    /**
     * Get current (uncompleted) order for session
     */
    getCurrentOrder(sessionId) {
        const orders = this.getOrdersBySession(sessionId);
        return orders.find((order) => order.status === constants_1.ORDER_STATUS.PENDING ||
            order.status === constants_1.ORDER_STATUS.CONFIRMED ||
            order.status === constants_1.ORDER_STATUS.PREPARING ||
            order.status === constants_1.ORDER_STATUS.READY) || null;
    }
    /**
     * Get order history (completed/cancelled orders)
     */
    getOrderHistory(sessionId) {
        const orders = this.getOrdersBySession(sessionId);
        return orders.filter((order) => order.status === constants_1.ORDER_STATUS.COMPLETED ||
            order.status === constants_1.ORDER_STATUS.CANCELLED);
    }
    /**
     * Update order status
     */
    updateOrderStatus(orderId, status) {
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
    cancelOrder(orderId) {
        const order = this.orders.get(orderId);
        if (order &&
            (order.status === constants_1.ORDER_STATUS.PENDING ||
                order.status === constants_1.ORDER_STATUS.CONFIRMED)) {
            order.status = constants_1.ORDER_STATUS.CANCELLED;
            order.updatedAt = new Date();
            return order;
        }
        return null;
    }
    /**
     * Update payment status
     */
    updatePaymentStatus(orderId, paymentStatus, paymentReference) {
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
    scheduleOrder(orderId, scheduledFor) {
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
    formatOrderForDisplay(order) {
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
    formatOrderHistory(orders) {
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map