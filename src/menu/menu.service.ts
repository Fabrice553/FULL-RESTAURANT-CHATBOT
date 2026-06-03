import { Injectable } from '@nestjs/common';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  options?: MenuOption[];
}

interface MenuOption {
  id: number;
  name: string;
  choices: string[];
}

/**
 * Menu Service - Manages restaurant menu items
 */
@Injectable()
export class MenuService {
  private menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Margherita Pizza',
      price: 12.99,
      description: 'Classic pizza with tomato, mozzarella, and basil',
      category: 'Pizza',
      options: [
        {
          id: 1,
          name: 'Size',
          choices: ['Small (8")', 'Medium (10")', 'Large (12")'],
        },
        {
          id: 2,
          name: 'Crust',
          choices: ['Thin', 'Regular', 'Thick'],
        },
      ],
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      price: 14.99,
      description: 'Pizza with pepperoni and extra cheese',
      category: 'Pizza',
      options: [
        {
          id: 1,
          name: 'Size',
          choices: ['Small (8")', 'Medium (10")', 'Large (12")'],
        },
        {
          id: 2,
          name: 'Crust',
          choices: ['Thin', 'Regular', 'Thick'],
        },
      ],
    },
    {
      id: 3,
      name: 'Cheeseburger',
      price: 9.99,
      description: 'Juicy burger with cheddar cheese and fresh toppings',
      category: 'Burgers',
      options: [
        {
          id: 1,
          name: 'Doneness',
          choices: ['Rare', 'Medium', 'Well-done'],
        },
        {
          id: 2,
          name: 'Toppings',
          choices: ['Lettuce & Tomato', 'Onions', 'Pickles', 'All'],
        },
      ],
    },
    {
      id: 4,
      name: 'Caesar Salad',
      price: 8.99,
      description: 'Fresh romaine lettuce with parmesan and croutons',
      category: 'Salads',
      options: [
        {
          id: 1,
          name: 'Dressing',
          choices: ['Caesar', 'Ranch', 'Balsamic'],
        },
      ],
    },
    {
      id: 5,
      name: 'Fried Chicken',
      price: 11.99,
      description: 'Crispy fried chicken with sides',
      category: 'Main Courses',
      options: [
        {
          id: 1,
          name: 'Pieces',
          choices: ['3 pieces', '6 pieces', '9 pieces'],
        },
        {
          id: 2,
          name: 'Sides',
          choices: ['Fries', 'Coleslaw', 'Rice', 'Mac & Cheese'],
        },
      ],
    },
    {
      id: 6,
      name: 'Spaghetti',
      price: 10.99,
      description: 'Pasta with marinara sauce and meatballs',
      category: 'Pasta',
      options: [
        {
          id: 1,
          name: 'Sauce Type',
          choices: ['Marinara', 'Alfredo', 'Pesto'],
        },
      ],
    },
    {
      id: 7,
      name: 'Coke',
      price: 2.99,
      description: 'Refreshing soft drink',
      category: 'Drinks',
      options: [
        {
          id: 1,
          name: 'Size',
          choices: ['Small (12 oz)', 'Medium (16 oz)', 'Large (20 oz)'],
        },
      ],
    },
    {
      id: 8,
      name: 'Chocolate Cake',
      price: 5.99,
      description: 'Rich chocolate cake with frosting',
      category: 'Desserts',
      options: [
        {
          id: 1,
          name: 'Extra',
          choices: ['None', 'Ice Cream', 'Whipped Cream'],
        },
      ],
    },
  ];

  /**
   * Get all menu items
   */
  getAllItems(): MenuItem[] {
    return this.menuItems;
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: string): MenuItem[] {
    return this.menuItems.filter((item) =>
      item.category.toLowerCase().includes(category.toLowerCase()),
    );
  }

  /**
   * Get item by ID
   */
  getItemById(id: number): MenuItem | null {
    return this.menuItems.find((item) => item.id === id) || null;
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.menuItems.forEach((item) => categories.add(item.category));
    return Array.from(categories);
  }

  /**
   * Format menu for display
   */
  formatMenuForDisplay(): string {
    const categories = this.getCategories();
    let message = '📋 **Menu Categories:**\n\n';

    categories.forEach((category, index) => {
      message += `${index + 1}️⃣  - ${category}\n`;
    });

    message += `\n0️⃣  - Back to Main Menu`;
    return message;
  }

  /**
   * Format category items for display
   */
  formatCategoryItems(category: string): string {
    const items = this.getItemsByCategory(category);
    let message = `📋 **${category}**\n\n`;

    items.forEach((item) => {
      message += `${item.id}️⃣  - ${item.name} ($${item.price.toFixed(2)})\n   ${item.description}\n\n`;
    });

    message += `0️⃣  - Back to Menu Categories`;
    return message;
  }

  /**
   * Format item options for display
   */
  formatItemOptions(itemId: number): string {
    const item = this.getItemById(itemId);
    if (!item) return 'Item not found';

    let message = `🍕 **${item.name}** - $${item.price.toFixed(2)}\n\n`;
    message += `${item.description}\n\n`;

    if (item.options && item.options.length > 0) {
      message += `**Select Options:**\n\n`;
      item.options.forEach((option) => {
        message += `**${option.name}:**\n`;
        option.choices.forEach((choice, index) => {
          message += `  ${index + 1}. ${choice}\n`;
        });
        message += '\n';
      });
    }

    message += `\nEnter option number or 'confirm' to add to cart\n0️⃣  - Back`;
    return message;
  }
}