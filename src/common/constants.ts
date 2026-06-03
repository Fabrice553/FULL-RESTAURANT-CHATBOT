/**
 * Chat Command Constants
 */
export const CHAT_COMMANDS = {
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
export const CHAT_STATES = {
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
export const ORDER_STATUS = {
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
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const MAIN_MENU_MESSAGE = `
🍽️ **Welcome to Restaurant ChatBot** 🍽️

Select an option:
1️⃣  - Place an order
99️⃣  - Checkout order
98️⃣  - See order history
97️⃣  - See current order
0️⃣  - Cancel order
`;