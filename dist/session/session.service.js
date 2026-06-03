"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const constants_1 = require("../common/constants");
/**
 * In-memory session store
 * In production, use Redis or a database
 */
let SessionService = class SessionService {
    constructor() {
        this.sessions = new Map();
    }
    /**
     * Get or create a session
     */
    getOrCreateSession(deviceId) {
        // Check if session exists for this device
        let session = Array.from(this.sessions.values()).find((s) => s.deviceId === deviceId);
        if (!session) {
            session = {
                sessionId: (0, uuid_1.v4)(),
                deviceId,
                state: constants_1.CHAT_STATES.MAIN_MENU,
                cart: [],
                currentOrder: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.sessions.set(session.sessionId, session);
        }
        return session;
    }
    /**
     * Get session by ID
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    /**
     * Update session state
     */
    updateSessionState(sessionId, state) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.state = state;
            session.updatedAt = new Date();
        }
        return session;
    }
    /**
     * Add item to cart
     */
    addToCart(sessionId, item) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.cart.push(item);
            session.updatedAt = new Date();
        }
    }
    /**
     * Get cart
     */
    getCart(sessionId) {
        const session = this.sessions.get(sessionId);
        return session?.cart || [];
    }
    /**
     * Clear cart
     */
    clearCart(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.cart = [];
            session.updatedAt = new Date();
        }
    }
    /**
     * Set current order
     */
    setCurrentOrder(sessionId, order) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.currentOrder = order;
            session.updatedAt = new Date();
        }
    }
    /**
     * Get current order
     */
    getCurrentOrder(sessionId) {
        const session = this.sessions.get(sessionId);
        return session?.currentOrder || null;
    }
    /**
     * Clear current order
     */
    clearCurrentOrder(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.currentOrder = null;
            session.updatedAt = new Date();
        }
    }
    /**
     * Reset session to main menu
     */
    resetSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.state = constants_1.CHAT_STATES.MAIN_MENU;
            session.cart = [];
            session.updatedAt = new Date();
        }
        return session;
    }
    /**
     * Delete session (logout)
     */
    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
    }
    /**
     * Get all sessions (for debugging)
     */
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)()
], SessionService);
//# sourceMappingURL=session.service.js.map