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
export declare class MenuService {
    private menuItems;
    /**
     * Get all menu items
     */
    getAllItems(): MenuItem[];
    /**
     * Get items by category
     */
    getItemsByCategory(category: string): MenuItem[];
    /**
     * Get item by ID
     */
    getItemById(id: number): MenuItem | null;
    /**
     * Get all categories
     */
    getCategories(): string[];
    /**
     * Format menu for display
     */
    formatMenuForDisplay(): string;
    /**
     * Format category items for display
     */
    formatCategoryItems(category: string): string;
    /**
     * Format item options for display
     */
    formatItemOptions(itemId: number): string;
}
export {};
//# sourceMappingURL=menu.service.d.ts.map