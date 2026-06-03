"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let ChatService = class ChatService {
    constructor() {
        this.sessions = new Map();
        this.menuItems = [
            { id: 1, name: 'Grilled Chicken', price: 25.99, description: 'Juicy grilled chicken with herbs' },
            { id: 2, name: 'Pasta Carbonara', price: 18.5, description: 'Classic Italian pasta' },
            { id: 3, name: 'Beef Burger', price: 22.0, description: 'Homemade beef burger with fries' },
            { id: 4, name: 'Caesar Salad', price: 12.99, description: 'Fresh garden salad' },
            { id: 5, name: 'Fish & Chips', price: 21.5, description: 'Crispy fish with golden chips' },
        ];
    }
    getOrCreateSession(deviceId) {
        if (!this.sessions.has(deviceId)) {
            this.sessions.set(deviceId, {
                sessionId: (0, uuid_1.v4)(),
                currentCart: [],
                orderHistory: [],
                createdAt: new Date(),
            });
        }
        return this.sessions.get(deviceId);
    }
    handleUserInput(deviceId, input) {
        const trimmedInput = input.trim();
        const session = this.getOrCreateSession(deviceId);
        // Validate input
        if (!trimmedInput) {
            return { message: '❌ Invalid input. Please enter a valid option.' };
        }
        const choice = trimmedInput;
        // Main menu options
        if (choice === '1') {
            return { message: this.getMenuOptions(), nextAction: 'selectMenuItem' };
        }
        if (choice === '99') {
            return { message: this.checkoutOrder(session) };
        }
        if (choice === '98') {
            return { message: this.getOrderHistory(session) };
        }
        if (choice === '97') {
            return { message: this.getCurrentOrder(session) };
        }
        if (choice === '0') {
            return { message: this.cancelOrder(session) };
        }
        // Handle menu item selection
        if (this.isNumericValid(choice)) {
            const itemId = parseInt(choice, 10);
            const menuItem = this.menuItems.find((item) => item.id === itemId);
            if (menuItem) {
                session.currentCart.push({ menuItem, quantity: 1 });
                return {
                    message: `✅ "${menuItem.name}" added to cart! ($${menuItem.price})\n\n📋 Current Cart Total: $${this.calculateCartTotal(session.currentCart).toFixed(2)}\n\nEnter another item number or select 99 to checkout.`,
                };
            }
        }
        return this.getMainMenu();
    }
    getMainMenu() {
        return {
            message: `
🍽️ **WELCOME TO RESTAURANT CHATBOT** 🤖

Please select an option:
📦 Select **1** - Place an order
💳 Select **99** - Checkout order
📜 Select **98** - See order history
📍 Select **97** - See current order
❌ Select **0** - Cancel order

What would you like to do?`,
        };
    }
    getMenuOptions() {
        let menuText = `
🍽️ **OUR MENU** 🍽️

`;
        this.menuItems.forEach((item) => {
            menuText += `**${item.id}** - ${item.name} - $${item.price.toFixed(2)}\n   📝 ${item.description}\n\n`;
        });
        menuText += `Select the item number to add to cart, or select 99 to checkout.`;
        return menuText;
    }
    checkoutOrder(session) {
        if (session.currentCart.length === 0) {
            return `❌ No order to place.\n\nWould you like to place a new order? Select **1** to continue.`;
        }
        const orderId = (0, uuid_1.v4)();
        const totalPrice = this.calculateCartTotal(session.currentCart);
        const order = {
            id: orderId,
            items: [...session.currentCart],
            totalPrice,
            status: 'pending',
            createdAt: new Date(),
        };
        session.currentOrder = order;
        session.orderHistory.push(order);
        session.currentCart = [];
        return `
✅ **ORDER CONFIRMED!**

Order ID: ${orderId}
Total Amount: $${totalPrice.toFixed(2)}

📦 Items:
${order.items.map((item) => `- ${item.menuItem.name} x${item.quantity} = $${(item.menuItem.price * item.quantity).toFixed(2)}`).join('\n')}

Proceed to payment? Select your preferred option:
💳 Select **1** - Pay with Paystack
⏰ Select **2** - Schedule order (optional)
🏠 Select **3** - Back to main menu
`;
    }
    getOrderHistory(session) {
        if (session.orderHistory.length === 0) {
            return `📜 **NO ORDER HISTORY**\n\nYou haven't placed any orders yet. Select **1** to start ordering.`;
        }
        let historyText = `📜 **ORDER HISTORY** 📜\n\n`;
        session.orderHistory.forEach((order, index) => {
            historyText += `**Order ${index + 1}** - ID: ${order.id}\n`;
            historyText += `Date: ${order.createdAt.toLocaleString()}\n`;
            historyText += `Total: $${order.totalPrice.toFixed(2)}\n`;
            historyText += `Status: ${order.status.toUpperCase()}\n`;
            historyText += `Items: ${order.items.map((item) => `${item.menuItem.name} x${item.quantity}`).join(', ')}\n\n`;
        });
        historyText += `Select **1** to place a new order.`;
        return historyText;
    }
    getCurrentOrder(session) {
        if (!session.currentOrder) {
            return `📍 **NO CURRENT ORDER**\n\nYou don't have an active order. Select **1** to start ordering.`;
        }
        const order = session.currentOrder;
        return `
📍 **CURRENT ORDER** 📍

Order ID: ${order.id}
Status: ${order.status.toUpperCase()}
Created: ${order.createdAt.toLocaleString()}

📦 Items:
${order.items.map((item) => `- ${item.menuItem.name} x${item.quantity} = $${(item.menuItem.price * item.quantity).toFixed(2)}`).join('\n')}

💰 Total: $${order.totalPrice.toFixed(2)}

Select **1** to place a new order.
`;
    }
    cancelOrder(session) {
        if (!session.currentOrder && session.currentCart.length === 0) {
            return `❌ **NO ORDER TO CANCEL**\n\nYou don't have any active order. Select **1** to start ordering.`;
        }
        if (session.currentOrder) {
            session.currentOrder = undefined;
        }
        session.currentCart = [];
        return `✅ **ORDER CANCELLED**\n\nYour order has been cancelled. Select **1** to place a new order.`;
    }
    calculateCartTotal(cart) {
        return cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
    }
    isNumericValid(input) {
        return /^\d+$/.test(input);
    }
    getCurrentOrderForPayment(deviceId) {
        const session = this.sessions.get(deviceId);
        return session?.currentOrder || null;
    }
    updateOrderStatus(deviceId, orderId, status) {
        const session = this.sessions.get(deviceId);
        if (session) {
            const order = session.orderHistory.find((o) => o.id === orderId);
            if (order) {
                order.status = status;
            }
        }
    }
    scheduleOrder(deviceId, orderId, scheduledDate) {
        const session = this.sessions.get(deviceId);
        if (session) {
            const order = session.orderHistory.find((o) => o.id === orderId);
            if (order) {
                order.scheduledDate = scheduledDate;
                return `✅ Order scheduled for ${scheduledDate.toLocaleString()}`;
            }
        }
        return '❌ Order not found';
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map