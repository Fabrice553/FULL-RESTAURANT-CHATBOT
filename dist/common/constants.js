"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAIN_MENU_MESSAGE = exports.PAYMENT_STATUS = exports.ORDER_STATUS = exports.CHAT_STATES = exports.CHAT_COMMANDS = void 0;
/**
 * Chat Command Constants
 */
exports.CHAT_COMMANDS = {
    PLACE_ORDER: 1,
    CHECKOUT: 99,
    ORDER_HISTORY: 98,
    CURRENT_ORDER: 97,
    CANCEL_ORDER: 0,
    BACK_TO_MENU: -1,
};
/**
 * Chat States
 */
exports.CHAT_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    BROWSING_MENU: 'BROWSING_MENU',
    SELECTING_ITEM: 'SELECTING_ITEM',
    ADDING_TO_CART: 'ADDING_TO_CART',
    VIEWING_CART: 'VIEWING_CART',
    CHECKOUT: 'CHECKOUT',
    PAYMENT: 'PAYMENT',
    ORDER_HISTORY: 'ORDER_HISTORY',
    CURRENT_ORDER: 'CURRENT_ORDER',
    SCHEDULING: 'SCHEDULING',
};
/**
 * Order Status
 */
exports.ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
/**
 * Payment Status
 */
exports.PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
};
exports.MAIN_MENU_MESSAGE = `
🍽️ **Welcome to Restaurant ChatBot** 🍽️

Select an option:
1️⃣  - Place an order
99️⃣  - Checkout order
98️⃣  - See order history
97️⃣  - See current order
0️⃣  - Cancel order
`;
//# sourceMappingURL=constants.js.map