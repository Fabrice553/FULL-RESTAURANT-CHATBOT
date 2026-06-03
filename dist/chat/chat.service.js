"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("../session/session.service");
const menu_service_1 = require("../menu/menu.service");
const order_service_1 = require("../order/order.service");
const payment_service_1 = require("../payment/payment.service");
const constants_1 = require("../common/constants");
/**
 * Chat Service - Main chatbot logic and flow
 */
let ChatService = class ChatService {
    constructor(sessionService, menuService, orderService, paymentService) {
        this.sessionService = sessionService;
        this.menuService = menuService;
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.cartItems = new Map();
        this.menuNavigationState = new Map(); // Track menu browsing state
        this.selectedItem = new Map(); // Track selected item for options
    }
    /**
     * Main chat message handler
     */
    async handleMessage(deviceId, userMessage) {
        const session = this.sessionService.getOrCreateSession(deviceId);
        const sessionId = session.sessionId;
        const userInput = userMessage.trim().toLowerCase();
        let botResponse = '';
        switch (session.state) {
            case constants_1.CHAT_STATES.MAIN_MENU:
                botResponse = await this.handleMainMenu(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.BROWSING_MENU:
                botResponse = await this.handleBrowsingMenu(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.SELECTING_ITEM:
                botResponse = await this.handleSelectingItem(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.ADDING_TO_CART:
                botResponse = await this.handleAddingToCart(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.VIEWING_CART:
                botResponse = await this.handleViewingCart(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.CHECKOUT:
                botResponse = await this.handleCheckout(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.PAYMENT:
                botResponse = await this.handlePayment(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.ORDER_HISTORY:
                botResponse = await this.handleOrderHistory(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.CURRENT_ORDER:
                botResponse = await this.handleCurrentOrder(sessionId, userInput);
                break;
            case constants_1.CHAT_STATES.SCHEDULING:
                botResponse = await this.handleScheduling(sessionId, userInput);
                break;
            default:
                botResponse = constants_1.MAIN_MENU_MESSAGE;
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
        }
        return {
            botResponse,
            sessionId,
        };
    }
    /**
     * Handle main menu interactions
     */
    async handleMainMenu(sessionId, input) {
        const command = this.parseCommand(input);
        switch (command) {
            case constants_1.CHAT_COMMANDS.PLACE_ORDER:
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.BROWSING_MENU);
                this.menuNavigationState.set(sessionId, { level: 'category' });
                return this.menuService.formatMenuForDisplay();
            case constants_1.CHAT_COMMANDS.CHECKOUT:
                return this.handleCheckoutFlow(sessionId);
            case constants_1.CHAT_COMMANDS.ORDER_HISTORY:
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.ORDER_HISTORY);
                const history = this.orderService.getOrderHistory(sessionId);
                return this.orderService.formatOrderHistory(history);
            case constants_1.CHAT_COMMANDS.CURRENT_ORDER:
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.CURRENT_ORDER);
                const currentOrder = this.orderService.getCurrentOrder(sessionId);
                if (!currentOrder) {
                    return '📦 **Current Order**\n\nNo current order found.\n\n0️⃣  - Back to Main Menu';
                }
                return this.orderService.formatOrderForDisplay(currentOrder);
            case constants_1.CHAT_COMMANDS.CANCEL_ORDER:
                return this.handleCancelOrder(sessionId);
            default:
                return constants_1.MAIN_MENU_MESSAGE;
        }
    }
    /**
     * Handle menu browsing
     */
    async handleBrowsingMenu(sessionId, input) {
        const command = this.parseCommand(input);
        const state = this.menuNavigationState.get(sessionId) || { level: 'category' };
        if (command === constants_1.CHAT_COMMANDS.BACK_TO_MENU || command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return constants_1.MAIN_MENU_MESSAGE;
        }
        if (state.level === 'category') {
            const categories = this.menuService.getCategories();
            if (command > 0 && command <= categories.length) {
                const category = categories[command - 1];
                state.level = 'items';
                state.category = category;
                this.menuNavigationState.set(sessionId, state);
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.BROWSING_MENU);
                return this.menuService.formatCategoryItems(category);
            }
        }
        else if (state.level === 'items') {
            const items = this.menuService.getItemsByCategory(state.category);
            const selectedItem = items.find((item) => item.id === command);
            if (selectedItem) {
                this.selectedItem.set(sessionId, selectedItem.id);
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.SELECTING_ITEM);
                return this.menuService.formatItemOptions(selectedItem.id);
            }
        }
        return '❌ Invalid selection. Please try again.';
    }
    /**
     * Handle item selection with options
     */
    async handleSelectingItem(sessionId, input) {
        const itemId = this.selectedItem.get(sessionId);
        const item = this.menuService.getItemById(itemId);
        if (!item) {
            return '❌ Item not found.';
        }
        if (input === '0') {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.BROWSING_MENU);
            const state = this.menuNavigationState.get(sessionId);
            return this.menuService.formatCategoryItems(state.category);
        }
        if (input === 'confirm') {
            // Add to cart
            if (!this.cartItems.has(sessionId)) {
                this.cartItems.set(sessionId, []);
            }
            const cart = this.cartItems.get(sessionId);
            const existingItem = cart.find((ci) => ci.itemId === itemId);
            if (existingItem) {
                existingItem.quantity += 1;
            }
            else {
                cart.push({
                    itemId,
                    itemName: item.name,
                    price: item.price,
                    quantity: 1,
                    selectedOptions: [],
                });
            }
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.VIEWING_CART);
            return this.formatCartForDisplay(sessionId);
        }
        return `✅ ${item.name} added to cart!\n\nWhat would you like to do?\n1️⃣  - Add another item\n2️⃣  - View cart\n0️⃣  - Back`;
    }
    /**
     * Handle cart viewing
     */
    async handleViewingCart(sessionId, input) {
        const command = this.parseCommand(input);
        if (command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            this.cartItems.delete(sessionId);
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return constants_1.MAIN_MENU_MESSAGE;
        }
        if (command === 1) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.BROWSING_MENU);
            return this.menuService.formatMenuForDisplay();
        }
        if (command === 99) {
            return this.handleCheckoutFlow(sessionId);
        }
        return this.formatCartForDisplay(sessionId);
    }
    /**
     * Handle checkout flow
     */
    handleCheckoutFlow(sessionId) {
        const cart = this.cartItems.get(sessionId) || [];
        if (cart.length === 0) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return '❌ No items in cart!\n\n' + constants_1.MAIN_MENU_MESSAGE;
        }
        // Create order from cart
        const orderItems = cart.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            price: item.price,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
        }));
        const order = this.orderService.createOrder(sessionId, orderItems);
        this.cartItems.delete(sessionId); // Clear cart
        this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.PAYMENT);
        return this.formatCheckoutSummary(order);
    }
    /**
     * Handle checkout command
     */
    handleCheckout(sessionId, input) {
        const command = this.parseCommand(input);
        if (command === 1) {
            // Proceed to payment
            const currentOrder = this.orderService.getCurrentOrder(sessionId);
            if (currentOrder) {
                return this.formatPaymentInstructions(sessionId, currentOrder);
            }
        }
        if (command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            const currentOrder = this.orderService.getCurrentOrder(sessionId);
            if (currentOrder) {
                this.orderService.cancelOrder(currentOrder.orderId);
            }
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return constants_1.MAIN_MENU_MESSAGE;
        }
        const currentOrder = this.orderService.getCurrentOrder(sessionId);
        return this.orderService.formatOrderForDisplay(currentOrder);
    }
    /**
     * Handle payment
     */
    async handlePayment(sessionId, input) {
        const command = this.parseCommand(input);
        if (command === 1) {
            // Initiate payment
            const currentOrder = this.orderService.getCurrentOrder(sessionId);
            if (!currentOrder) {
                return '❌ No order found.';
            }
            try {
                const paymentLink = await this.paymentService.generatePaymentLink('customer@restaurant.com', currentOrder.totalAmount, currentOrder.orderId);
                // Update order with payment reference
                this.orderService.updatePaymentStatus(currentOrder.orderId, 'PENDING', paymentLink.reference);
                this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
                return this.paymentService.formatPaymentMessage(paymentLink.authorizationUrl, currentOrder.totalAmount * 100, currentOrder.orderId);
            }
            catch (error) {
                return '❌ Failed to generate payment link. Please try again.';
            }
        }
        if (command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            const currentOrder = this.orderService.getCurrentOrder(sessionId);
            if (currentOrder) {
                this.orderService.cancelOrder(currentOrder.orderId);
            }
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return 'Order cancelled.\n\n' + constants_1.MAIN_MENU_MESSAGE;
        }
        const currentOrder = this.orderService.getCurrentOrder(sessionId);
        return this.formatCheckoutSummary(currentOrder);
    }
    /**
     * Handle order history
     */
    async handleOrderHistory(sessionId, input) {
        const command = this.parseCommand(input);
        if (command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return constants_1.MAIN_MENU_MESSAGE;
        }
        const history = this.orderService.getOrderHistory(sessionId);
        return this.orderService.formatOrderHistory(history);
    }
    /**
     * Handle current order
     */
    async handleCurrentOrder(sessionId, input) {
        const command = this.parseCommand(input);
        if (command === constants_1.CHAT_COMMANDS.CANCEL_ORDER) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return constants_1.MAIN_MENU_MESSAGE;
        }
        const currentOrder = this.orderService.getCurrentOrder(sessionId);
        if (!currentOrder) {
            return '📦 **Current Order**\n\nNo current order found.\n\n' + constants_1.MAIN_MENU_MESSAGE;
        }
        return this.orderService.formatOrderForDisplay(currentOrder);
    }
    /**
     * Handle order cancellation
     */
    handleCancelOrder(sessionId) {
        const currentOrder = this.orderService.getCurrentOrder(sessionId);
        if (!currentOrder) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return '❌ No current order to cancel.\n\n' + constants_1.MAIN_MENU_MESSAGE;
        }
        const cancelled = this.orderService.cancelOrder(currentOrder.orderId);
        if (cancelled) {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.MAIN_MENU);
            return `✅ Order #${cancelled.orderId.slice(0, 8)} has been cancelled.\n\n` + constants_1.MAIN_MENU_MESSAGE;
        }
        return '❌ Cannot cancel this order. Please contact support.\n\n' + constants_1.MAIN_MENU_MESSAGE;
    }
    /**
     * Handle adding to cart
     */
    async handleAddingToCart(sessionId, input) {
        if (input === '0') {
            this.sessionService.updateSessionState(sessionId, constants_1.CHAT_STATES.VIEWING_CART);
            return this.formatCartForDisplay(sessionId);
        }
        return 'Item added to cart!';
    }
    /**
     * Handle scheduling
     */
    async handleScheduling(sessionId, input) {
        return 'Scheduling feature coming soon!';
    }
    /**
     * Format cart for display
     */
    formatCartForDisplay(sessionId) {
        const cart = this.cartItems.get(sessionId) || [];
        if (cart.length === 0) {
            return '🛒 **Your Cart**\n\nCart is empty.\n\n1️⃣  - Continue Shopping\n0️⃣  - Back to Menu';
        }
        let message = '🛒 **Your Cart**\n\n';
        let total = 0;
        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            message += `${index + 1}. ${item.itemName} x${item.quantity} - $${subtotal.toFixed(2)}\n`;
        });
        message += `\n**Total: $${total.toFixed(2)}**\n\n`;
        message += `1️⃣  - Add more items\n`;
        message += `99️⃣  - Checkout\n`;
        message += `0️⃣  - Clear cart`;
        return message;
    }
    /**
     * Format checkout summary
     */
    formatCheckoutSummary(order) {
        const message = this.orderService.formatOrderForDisplay(order);
        return (message +
            `\n\n1️⃣  - Proceed to Payment\n` +
            `0️⃣  - Cancel Order`);
    }
    /**
     * Format payment instructions
     */
    formatPaymentInstructions(sessionId, order) {
        return (`💳 **Ready for Payment**\n\n` +
            `Order Total: $${order.totalAmount.toFixed(2)}\n` +
            `Order ID: #${order.orderId.slice(0, 8)}\n\n` +
            `1️⃣  - Proceed to Paystack Payment\n` +
            `0️⃣  - Cancel Order`);
    }
    /**
     * Parse numeric command from user input
     */
    parseCommand(input) {
        const num = parseInt(input.replace(/[^\d-]/g, ''), 10);
        return isNaN(num) ? -1 : num;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        menu_service_1.MenuService,
        order_service_1.OrderService,
        payment_service_1.PaymentService])
], ChatService);
//# sourceMappingURL=chat.service.js.map