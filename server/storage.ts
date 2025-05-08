import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  favorites, type Favorite, type InsertFavorite,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByGender(gender: string): Promise<Product[]>;
  getProductsByCategoryAndGender(category: string, gender: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemWithDetails(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  
  // Favorites methods
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavoritesWithDetails(userId: number): Promise<(Favorite & { product: Product })[]>;
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: number, productId: number): Promise<boolean>;
  
  // Notifications methods
  getNotifications(userId: number): Promise<Notification[]>;
  addNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private favorites: Map<number, Favorite>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private favoriteIdCounter: number;
  private notificationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.favorites = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with some products
    this.initializeProducts();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }
  
  async getProductsByGender(gender: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.gender === gender,
    );
  }
  
  async getProductsByCategoryAndGender(category: string, gender: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category && product.gender === gender,
    );
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId,
    );
  }
  
  async getCartItemWithDetails(userId: number): Promise<(CartItem & { product: Product })[]> {
    const cartItems = await this.getCartItems(userId);
    return cartItems.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      return { ...item, product };
    });
  }
  
  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item is already in the cart with the same size
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => 
        item.userId === insertCartItem.userId && 
        item.productId === insertCartItem.productId &&
        item.size === insertCartItem.size
    );
    
    if (existingItem) {
      // Update quantity instead of adding new item
      const updatedItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + insertCartItem.quantity 
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }
    
    const id = this.cartItemIdCounter++;
    const cartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      return undefined;
    }
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Favorites methods
  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId,
    );
  }
  
  async getFavoritesWithDetails(userId: number): Promise<(Favorite & { product: Product })[]> {
    const favorites = await this.getFavorites(userId);
    return favorites.map(favorite => {
      const product = this.products.get(favorite.productId);
      if (!product) {
        throw new Error(`Product not found: ${favorite.productId}`);
      }
      return { ...favorite, product };
    });
  }
  
  async addToFavorites(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if already in favorites
    const existingFavorite = Array.from(this.favorites.values()).find(
      (favorite) => 
        favorite.userId === insertFavorite.userId && 
        favorite.productId === insertFavorite.productId
    );
    
    if (existingFavorite) {
      return existingFavorite;
    }
    
    const id = this.favoriteIdCounter++;
    const favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFromFavorites(userId: number, productId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      (favorite) => 
        favorite.userId === userId && 
        favorite.productId === productId
    );
    
    if (!favorite) {
      return false;
    }
    
    return this.favorites.delete(favorite.id);
  }
  
  // Notifications methods
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.id - a.id); // Sort by ID descending (newest first)
  }
  
  async addNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification = { ...insertNotification, id };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }

  private initializeProducts() {
    const productsData: InsertProduct[] = [
      {
        name: "Summer Floral Dress",
        price: 5999, // $59.99
        description: "Elegant white summer dress with floral pattern",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "dresses",
        gender: "women",
        availableSizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        name: "Denim Casual Shirt",
        price: 4599, // $45.99
        description: "Classic denim shirt for a casual look",
        imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "shirts",
        gender: "men",
        availableSizes: ["S", "M", "L", "XL", "2XL"],
      },
      {
        name: "Leather Biker Jacket",
        price: 8999, // $89.99
        description: "Premium black leather jacket for a bold look",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "jackets",
        gender: "women",
        availableSizes: ["S", "M", "L"],
      },
      {
        name: "Classic White Sneakers",
        price: 6599, // $65.99
        description: "Comfortable casual sneakers for everyday wear",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "shoes",
        gender: "men",
        availableSizes: ["40", "41", "42", "43", "44", "45"],
      },
      {
        name: "Slim Fit T-Shirt",
        price: 2499, // $24.99
        description: "Comfortable slim fit t-shirt for everyday wear",
        imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "tshirts",
        gender: "men",
        availableSizes: ["S", "M", "L", "XL"],
      },
      {
        name: "High Waist Jeans",
        price: 3999, // $39.99
        description: "Stylish high waist jeans for a modern look",
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "pants",
        gender: "women",
        availableSizes: ["XS", "S", "M", "L"],
      },
      {
        name: "Wool Winter Coat",
        price: 11999, // $119.99
        description: "Warm wool coat perfect for winter season",
        imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "coats",
        gender: "women",
        availableSizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Chino Pants",
        price: 3499, // $34.99
        description: "Classic chino pants for casual and formal occasions",
        imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
        category: "pants",
        gender: "men",
        availableSizes: ["30", "32", "34", "36", "38"],
      },
    ];
    
    productsData.forEach(product => {
      const id = this.productIdCounter++;
      this.products.set(id, { ...product, id });
    });
    
    // Add initial notification for testing
    this.notifications.set(1, {
      id: 1,
      userId: 1,
      message: "Welcome to FashionZone! Explore our new summer collection.",
      read: false,
    });
  }
}

export const storage = new MemStorage();
