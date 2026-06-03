import { Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { MenuService } from '../menu/menu.service';
import { OrderService, OrderItem } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import { CHAT_COMMANDS, CHAT_STATES, MAIN_MENU_MESSAGE, ORDER_STATUS } from '../common/constants';

interface ChatMessage {
  sessionId: string;
  userMessage: string;
  botResponse: string;
  timestamp: Date;
}

interface CartItem {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  selectedOptions: string[];
}

/**
 * Chat Service - Main chatbot logic and flow
 */
@Injectable()
export class ChatService {
  private cartItems: Map<string, CartItem[]> = new Map();
  private menuNavigationState: Map<string, any> = new Map(); // Track menu browsing state
  private selectedItem: Map<string, number> = new Map(); // Track selected item for options

  constructor(
    private sessionService: SessionService,
    private menuService: MenuService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  /**
   * Main chat message handler
   */
  async handleMessage(
    deviceId: string,
    userMessage: string,
  ): Promise<{ botResponse: string; sessionId: string }> {
    const session = this.sessionService.getOrCreateSession(deviceId);
    const sessionId = session.sessionId;
    const userInput = userMessage.trim().toLowerCase();

    let botResponse = '';

    switch (session.state) {
      case CHAT_STATES.MAIN_MENU:
        botResponse = await this.handleMainMenu(sessionId, userInput);
        break;

      case CHAT_STATES.BROWSING_MENU:
        botResponse = await this.handleBrowsingMenu(sessionId, userInput);
        break;

      case CHAT_STATES.SELECTING_ITEM:
        botResponse = await this.handleSelectingItem(sessionId, userInput);
        break;

      case CHAT_STATES.ADDING_TO_CART:
        botResponse = await this.handleAddingToCart(sessionId, userInput);
        break;

      case CHAT_STATES.VIEWING_CART:
        botResponse = await this.handleViewingCart(sessionId, userInput);
        break;

      case CHAT_STATES.CHECKOUT:
        botResponse = await this.handleCheckout(sessionId, userInput);
        break;

      case CHAT_STATES.PAYMENT:
        botResponse = await this.handlePayment(sessionId, userInput);
        break;

      case CHAT_STATES.ORDER_HISTORY:
        botResponse = await this.handleOrderHistory(sessionId, userInput);
        break;

      case CHAT_STATES.CURRENT_ORDER:
        botResponse = await this.handleCurrentOrder(sessionId, userInput);
        break;

      case CHAT_STATES.SCHEDULING:
        botResponse = await this.handleScheduling(sessionId, userInput);
        break;

      default:
        botResponse = MAIN_MENU_MESSAGE;
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
    }

    return {
      botResponse,
      sessionId,
    };
  }

  /**
   * Handle main menu interactions
   */
  private async handleMainMenu(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);

    switch (command) {
      case CHAT_COMMANDS.PLACE_ORDER:
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.BROWSING_MENU);
        this.menuNavigationState.set(sessionId, { level: 'category' });
        return this.menuService.formatMenuForDisplay();

      case CHAT_COMMANDS.CHECKOUT:
        return this.handleCheckoutFlow(sessionId);

      case CHAT_COMMANDS.ORDER_HISTORY:
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.ORDER_HISTORY);
        const history = this.orderService.getOrderHistory(sessionId);
        return this.orderService.formatOrderHistory(history);

      case CHAT_COMMANDS.CURRENT_ORDER:
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.CURRENT_ORDER);
        const currentOrder = this.orderService.getCurrentOrder(sessionId);
        if (!currentOrder) {
          return '📦 **Current Order**\n\nNo current order found.\n\n0️⃣  - Back to Main Menu';
        }
        return this.orderService.formatOrderForDisplay(currentOrder);

      case CHAT_COMMANDS.CANCEL_ORDER:
        return this.handleCancelOrder(sessionId);

      default:
        return MAIN_MENU_MESSAGE;
    }
  }

  /**
   * Handle menu browsing
   */
  private async handleBrowsingMenu(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);
    const state = this.menuNavigationState.get(sessionId) || { level: 'category' };

    if (command === CHAT_COMMANDS.BACK_TO_MENU || command === CHAT_COMMANDS.CANCEL_ORDER) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return MAIN_MENU_MESSAGE;
    }

    if (state.level === 'category') {
      const categories = this.menuService.getCategories();
      if (command > 0 && command <= categories.length) {
        const category = categories[command - 1];
        state.level = 'items';
        state.category = category;
        this.menuNavigationState.set(sessionId, state);
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.BROWSING_MENU);
        return this.menuService.formatCategoryItems(category);
      }
    } else if (state.level === 'items') {
      const items = this.menuService.getItemsByCategory(state.category);
      const selectedItem = items.find((item) => item.id === command);

      if (selectedItem) {
        this.selectedItem.set(sessionId, selectedItem.id);
        this.sessionService.updateSessionState(sessionId, CHAT_STATES.SELECTING_ITEM);
        return this.menuService.formatItemOptions(selectedItem.id);
      }
    }

    return '❌ Invalid selection. Please try again.';
  }

  /**
   * Handle item selection with options
   */
  private async handleSelectingItem(sessionId: string, input: string): Promise<string> {
    const itemId = this.selectedItem.get(sessionId);
    const item = this.menuService.getItemById(itemId);

    if (!item) {
      return '❌ Item not found.';
    }

    if (input === '0') {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.BROWSING_MENU);
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
      } else {
        cart.push({
          itemId,
          itemName: item.name,
          price: item.price,
          quantity: 1,
          selectedOptions: [],
        });
      }

      this.sessionService.updateSessionState(sessionId, CHAT_STATES.VIEWING_CART);
      return `✅ ${item.name} added to cart!\n\n` + this.formatCartForDisplay(sessionId);
    }

    return `✅ ${item.name} selected!\n\nEnter 'confirm' to add to cart or '0' to go back`;
  }

  /**
   * Handle cart viewing
   */
  private async handleViewingCart(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);

    if (command === CHAT_COMMANDS.CANCEL_ORDER) {
      this.cartItems.delete(sessionId);
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return MAIN_MENU_MESSAGE;
    }

    if (command === 1) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.BROWSING_MENU);
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
  private handleCheckoutFlow(sessionId: string): string {
    const cart = this.cartItems.get(sessionId) || [];

    if (cart.length === 0) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return '❌ No items in cart!\n\n' + MAIN_MENU_MESSAGE;
    }

    // Create order from cart
    const orderItems: OrderItem[] = cart.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
    }));

    const order = this.orderService.createOrder(sessionId, orderItems);
    this.cartItems.delete(sessionId); // Clear cart

    this.sessionService.updateSessionState(sessionId, CHAT_STATES.PAYMENT);
    return this.formatCheckoutSummary(order);
  }

  /**
   * Handle checkout command
   */
  private handleCheckout(sessionId: string, input: string): string {
    const command = this.parseCommand(input);

    if (command === 1) {
      // Proceed to payment
      const currentOrder = this.orderService.getCurrentOrder(sessionId);
      if (currentOrder) {
        return this.formatPaymentInstructions(sessionId, currentOrder);
      }
    }

    if (command === CHAT_COMMANDS.CANCEL_ORDER) {
      const currentOrder = this.orderService.getCurrentOrder(sessionId);
      if (currentOrder) {
        this.orderService.cancelOrder(currentOrder.orderId);
      }
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return MAIN_MENU_MESSAGE;
    }

    const currentOrder = this.orderService.getCurrentOrder(sessionId);
    return this.orderService.formatOrderForDisplay(currentOrder);
  }

  /**
   * Handle payment
   */
  private async handlePayment(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);

    if (command === 1) {
      // Initiate payment
      const currentOrder = this.orderService.getCurrentOrder(sessionId);
      if (!currentOrder) {
        return '❌ No order found.';
      }

      try {
        const paymentLink = await this.paymentService.generatePaymentLink(
          'customer@restaurant.com',
          currentOrder.totalAmount,
          currentOrder.orderId,
        );

        // Update order with payment reference
        this.orderService.updatePaymentStatus(
          currentOrder.orderId,
          'PENDING',
          paymentLink.reference,
        );

        this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);

        return this.paymentService.formatPaymentMessage(
          paymentLink.authorizationUrl,
          currentOrder.totalAmount * 100,
          currentOrder.orderId,
        );
      } catch (error) {
        return '❌ Failed to generate payment link. Please try again.';
      }
    }

    if (command === CHAT_COMMANDS.CANCEL_ORDER) {
      const currentOrder = this.orderService.getCurrentOrder(sessionId);
      if (currentOrder) {
        this.orderService.cancelOrder(currentOrder.orderId);
      }
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return 'Order cancelled.\n\n' + MAIN_MENU_MESSAGE;
    }

    const currentOrder = this.orderService.getCurrentOrder(sessionId);
    return this.formatCheckoutSummary(currentOrder);
  }

  /**
   * Handle order history
   */
  private async handleOrderHistory(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);

    if (command === CHAT_COMMANDS.CANCEL_ORDER) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return MAIN_MENU_MESSAGE;
    }

    const history = this.orderService.getOrderHistory(sessionId);
    return this.orderService.formatOrderHistory(history);
  }

  /**
   * Handle current order
   */
  private async handleCurrentOrder(sessionId: string, input: string): Promise<string> {
    const command = this.parseCommand(input);

    if (command === CHAT_COMMANDS.CANCEL_ORDER) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return MAIN_MENU_MESSAGE;
    }

    const currentOrder = this.orderService.getCurrentOrder(sessionId);
    if (!currentOrder) {
      return '📦 **Current Order**\n\nNo current order found.\n\n' + MAIN_MENU_MESSAGE;
    }

    return this.orderService.formatOrderForDisplay(currentOrder);
  }

  /**
   * Handle order cancellation
   */
  private handleCancelOrder(sessionId: string): string {
    const currentOrder = this.orderService.getCurrentOrder(sessionId);

    if (!currentOrder) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return '❌ No current order to cancel.\n\n' + MAIN_MENU_MESSAGE;
    }

    const cancelled = this.orderService.cancelOrder(currentOrder.orderId);
    if (cancelled) {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.MAIN_MENU);
      return `✅ Order #${cancelled.orderId.slice(0, 8)} has been cancelled.\n\n` + MAIN_MENU_MESSAGE;
    }

    return '❌ Cannot cancel this order. Please contact support.\n\n' + MAIN_MENU_MESSAGE;
  }

  /**
   * Handle adding to cart
   */
  private async handleAddingToCart(sessionId: string, input: string): Promise<string> {
    if (input === '0') {
      this.sessionService.updateSessionState(sessionId, CHAT_STATES.VIEWING_CART);
      return this.formatCartForDisplay(sessionId);
    }

    return 'Item added to cart!';
  }

  /**
   * Handle scheduling
   */
  private async handleScheduling(sessionId: string, input: string): Promise<string> {
    return 'Scheduling feature coming soon!';
  }

  /**
   * Format cart for display
   */
  private formatCartForDisplay(sessionId: string): string {
    const cart = this.cartItems.get(sessionId) || [];

    if (cart.length === 0) {
      return '🛒 **Your Cart**\n\nCart is empty.\n\n1️⃣  - Continue Shopping\n99️⃣  - Place Order\n0️⃣  - Back to Main Menu';
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
    message += `0️⃣  - Back to Main Menu`;

    return message;
  }

  /**
   * Format checkout summary
   */
  private formatCheckoutSummary(order: any): string {
    const message = this.orderService.formatOrderForDisplay(order);
    return (
      message +
      `\n\n1️⃣  - Proceed to Payment\n` +
      `0️⃣  - Cancel Order`
    );
  }

  /**
   * Format payment instructions
   */
  private formatPaymentInstructions(sessionId: string, order: any): string {
    return (
      `💳 **Ready for Payment**\n\n` +
      `Order Total: $${order.totalAmount.toFixed(2)}\n` +
      `Order ID: #${order.orderId.slice(0, 8)}\n\n` +
      `1️⃣  - Proceed to Paystack Payment\n` +
      `0️⃣  - Cancel Order`
    );
  }

  /**
   * Parse numeric command from user input
   */
  private parseCommand(input: string): number {
    const num = parseInt(input.replace(/[^\d-]/g, ''), 10);
    return isNaN(num) ? -1 : num;
  }
}
