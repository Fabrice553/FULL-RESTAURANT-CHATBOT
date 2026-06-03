interface UserSession {
    sessionId: string;
    deviceId: string;
    state: string;
    cart: any[];
    currentOrder: any | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * In-memory session store
 * In production, use Redis or a database
 */
export declare class SessionService {
    private sessions;
    /**
     * Get or create a session
     */
    getOrCreateSession(deviceId: string): UserSession;
    /**
     * Get session by ID
     */
    getSession(sessionId: string): UserSession | null;
    /**
     * Update session state
     */
    updateSessionState(sessionId: string, state: string): UserSession;
    /**
     * Add item to cart
     */
    addToCart(sessionId: string, item: any): void;
    /**
     * Get cart
     */
    getCart(sessionId: string): any[];
    /**
     * Clear cart
     */
    clearCart(sessionId: string): void;
    /**
     * Set current order
     */
    setCurrentOrder(sessionId: string, order: any): void;
    /**
     * Get current order
     */
    getCurrentOrder(sessionId: string): any | null;
    /**
     * Clear current order
     */
    clearCurrentOrder(sessionId: string): void;
    /**
     * Reset session to main menu
     */
    resetSession(sessionId: string): UserSession;
    /**
     * Delete session (logout)
     */
    deleteSession(sessionId: string): void;
    /**
     * Get all sessions (for debugging)
     */
    getAllSessions(): UserSession[];
}
export {};
//# sourceMappingURL=session.service.d.ts.map