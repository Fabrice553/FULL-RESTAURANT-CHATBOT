import { SessionService } from '../session/session.service';
import { MenuService } from '../menu/menu.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
/**
 * Chat Service - Main chatbot logic and flow
 */
export declare class ChatService {
    private sessionService;
    private menuService;
    private orderService;
    private paymentService;
    private cartItems;
    private menuNavigationState;
    private selectedItem;
    constructor(sessionService: SessionService, menuService: MenuService, orderService: OrderService, paymentService: PaymentService);
    /**
     * Main chat message handler
     */
    handleMessage(deviceId: string, userMessage: string): Promise<{
        botResponse: string;
        sessionId: string;
    }>;
    /**
     * Handle main menu interactions
     */
    private handleMainMenu;
    /**
     * Handle menu browsing
     */
    private handleBrowsingMenu;
    /**
     * Handle item selection with options
     */
    private handleSelectingItem;
    /**
     * Handle cart viewing
     */
    private handleViewingCart;
    /**
     * Handle checkout flow
     */
    private handleCheckoutFlow;
    /**
     * Handle checkout command
     */
    private handleCheckout;
    /**
     * Handle payment
     */
    private handlePayment;
    /**
     * Handle order history
     */
    private handleOrderHistory;
    /**
     * Handle current order
     */
    private handleCurrentOrder;
    /**
     * Handle order cancellation
     */
    private handleCancelOrder;
    /**
     * Handle adding to cart
     */
    private handleAddingToCart;
    /**
     * Handle scheduling
     */
    private handleScheduling;
    /**
     * Format cart for display
     */
    private formatCartForDisplay;
    /**
     * Format checkout summary
     */
    private formatCheckoutSummary;
    /**
     * Format payment instructions
     */
    private formatPaymentInstructions;
    /**
     * Parse numeric command from user input
     */
    private parseCommand;
}
//# sourceMappingURL=chat.service.d.ts.map