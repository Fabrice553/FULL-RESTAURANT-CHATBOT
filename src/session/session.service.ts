import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CHAT_STATES, MAIN_MENU_MESSAGE } from '../common/constants';

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
@Injectable()
export class SessionService {
  private sessions: Map<string, UserSession> = new Map();

  /**
   * Get or create a session
   */
  getOrCreateSession(deviceId: string): UserSession {
    // Check if session exists for this device
    let session = Array.from(this.sessions.values()).find(
      (s) => s.deviceId === deviceId,
    );

    if (!session) {
      session = {
        sessionId: uuidv4(),
        deviceId,
        state: CHAT_STATES.MAIN_MENU,
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
  getSession(sessionId: string): UserSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Update session state
   */
  updateSessionState(sessionId: string, state: string): UserSession {
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
  addToCart(sessionId: string, item: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.cart.push(item);
      session.updatedAt = new Date();
    }
  }

  /**
   * Get cart
   */
  getCart(sessionId: string): any[] {
    const session = this.sessions.get(sessionId);
    return session?.cart || [];
  }

  /**
   * Clear cart
   */
  clearCart(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.cart = [];
      session.updatedAt = new Date();
    }
  }

  /**
   * Set current order
   */
  setCurrentOrder(sessionId: string, order: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.currentOrder = order;
      session.updatedAt = new Date();
    }
  }

  /**
   * Get current order
   */
  getCurrentOrder(sessionId: string): any | null {
    const session = this.sessions.get(sessionId);
    return session?.currentOrder || null;
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.currentOrder = null;
      session.updatedAt = new Date();
    }
  }

  /**
   * Reset session to main menu
   */
  resetSession(sessionId: string): UserSession {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.state = CHAT_STATES.MAIN_MENU;
      session.cart = [];
      session.updatedAt = new Date();
    }
    return session;
  }

  /**
   * Delete session (logout)
   */
  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Get all sessions (for debugging)
   */
  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }
}