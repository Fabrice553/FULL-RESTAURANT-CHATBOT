cat > README.md << 'EOF'
# 🍽️ Restaurant ChatBot

A full-featured restaurant ordering chatbot built with **NestJS** and **TypeScript**. Customers can browse menus, place orders, view history, and pay using **Paystack**.

## 📋 Features

- 🤖 Interactive chat interface
- 🍕 Browse restaurant menu
- 🛒 Add items to cart
- 💳 Paystack payment integration
- 📜 Order history tracking
- 📍 View current orders
- ❌ Cancel orders
- ⏰ Schedule orders (optional)
- 📱 Device-based session management
- ✅ Input validation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd restaurant-chatbot

# Install dependencies
npm install

# Install types
npm install --save-dev @types/uuid

# Create .env file
cat > .env << 'ENVEOF'
PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY
PAYSTACK_PUBLIC_KEY=pk_test_YOUR_KEY
NODE_ENV=development
PORT=3000
ENVEOF
