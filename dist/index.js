var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  favorites: () => favorites,
  favoritesRelations: () => favoritesRelations,
  insertCartItemSchema: () => insertCartItemSchema,
  insertFavoriteSchema: () => insertFavoriteSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertProductSchema: () => insertProductSchema,
  insertUserSchema: () => insertUserSchema,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  favorites: many(favorites),
  notifications: many(notifications)
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  gender: text("gender").notNull(),
  availableSizes: jsonb("available_sizes").notNull()
});
var productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
  favorites: many(favorites)
}));
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull()
});
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true
});
var favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull()
});
var favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id]
  })
}));
var insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false)
});
var notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { and, eq } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Product methods
  async getProducts() {
    return await db.select().from(products);
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || void 0;
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(eq(products.category, category));
  }
  async getProductsByGender(gender) {
    return await db.select().from(products).where(eq(products.gender, gender));
  }
  async getProductsByCategoryAndGender(category, gender) {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.gender, gender)));
  }
  async searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    const allProducts = await db.select().from(products);
    return allProducts.filter(
      (product) => product.name.toLowerCase().includes(lowercaseQuery) || product.description.toLowerCase().includes(lowercaseQuery) || product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
  // Cart methods
  async getCartItems(userId) {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }
  async getCartItemWithDetails(userId) {
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    const result = [];
    for (const item of items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (product) {
        result.push({ ...item, product });
      }
    }
    return result;
  }
  async addToCart(insertCartItem) {
    const [existingItem] = await db.select().from(cartItems).where(
      and(
        eq(cartItems.userId, insertCartItem.userId),
        eq(cartItems.productId, insertCartItem.productId),
        eq(cartItems.size, insertCartItem.size)
      )
    );
    if (existingItem) {
      const [updatedItem] = await db.update(cartItems).set({ quantity: existingItem.quantity + insertCartItem.quantity }).where(eq(cartItems.id, existingItem.id)).returning();
      return updatedItem;
    }
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }
  async updateCartItem(id, quantity) {
    const [updatedItem] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return updatedItem || void 0;
  }
  async removeFromCart(id) {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return !!result;
  }
  // Favorites methods
  async getFavorites(userId) {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }
  async getFavoritesWithDetails(userId) {
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    const result = [];
    for (const favorite of userFavorites) {
      const [product] = await db.select().from(products).where(eq(products.id, favorite.productId));
      if (product) {
        result.push({ ...favorite, product });
      }
    }
    return result;
  }
  async addToFavorites(insertFavorite) {
    const [existingFavorite] = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, insertFavorite.userId),
        eq(favorites.productId, insertFavorite.productId)
      )
    );
    if (existingFavorite) {
      return existingFavorite;
    }
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }
  async removeFromFavorites(userId, productId) {
    const result = await db.delete(favorites).where(
      and(eq(favorites.userId, userId), eq(favorites.productId, productId))
    );
    return !!result;
  }
  // Notifications methods
  async getNotifications(userId) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(notifications.id);
  }
  async addNotification(insertNotification) {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }
  async markNotificationAsRead(id) {
    const [updatedNotification] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning();
    return updatedNotification || void 0;
  }
  async deleteNotification(id) {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return !!result;
  }
};
async function initializeDatabase() {
  try {
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      const productsData = [
        {
          name: "Summer Floral Dress",
          price: 5999,
          // $59.99
          description: "Elegant white summer dress with floral pattern",
          imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "dresses",
          gender: "women",
          availableSizes: ["XS", "S", "M", "L", "XL"]
        },
        {
          name: "Denim Casual Shirt",
          price: 4599,
          // $45.99
          description: "Classic denim shirt for a casual look",
          imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "shirts",
          gender: "men",
          availableSizes: ["S", "M", "L", "XL", "2XL"]
        },
        {
          name: "Leather Biker Jacket",
          price: 8999,
          // $89.99
          description: "Premium black leather jacket for a bold look",
          imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "jackets",
          gender: "women",
          availableSizes: ["S", "M", "L"]
        },
        {
          name: "Classic White Sneakers",
          price: 6599,
          // $65.99
          description: "Comfortable casual sneakers for everyday wear",
          imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "shoes",
          gender: "men",
          availableSizes: ["40", "41", "42", "43", "44", "45"]
        },
        {
          name: "Slim Fit T-Shirt",
          price: 2499,
          // $24.99
          description: "Comfortable slim fit t-shirt for everyday wear",
          imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "tshirts",
          gender: "men",
          availableSizes: ["S", "M", "L", "XL"]
        },
        {
          name: "High Waist Jeans",
          price: 3999,
          // $39.99
          description: "Stylish high waist jeans for a modern look",
          imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "pants",
          gender: "women",
          availableSizes: ["XS", "S", "M", "L"]
        },
        {
          name: "Wool Winter Coat",
          price: 11999,
          // $119.99
          description: "Warm wool coat perfect for winter season",
          imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "coats",
          gender: "women",
          availableSizes: ["S", "M", "L", "XL"]
        },
        {
          name: "Chino Pants",
          price: 3499,
          // $34.99
          description: "Classic chino pants for casual and formal occasions",
          imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800&q=80",
          category: "pants",
          gender: "men",
          availableSizes: ["30", "32", "34", "36", "38"]
        }
      ];
      await db.insert(products).values(productsData);
      await db.insert(notifications).values({
        userId: 1,
        message: "Welcome to FashionZone! Explore our new summer collection.",
        read: false
      });
      console.log("Database initialized with sample data");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
async function setupDatabase() {
  console.log("\u{1F50C} \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0431\u0430\u0437\u0435 \u0434\u0430\u043D\u043D\u044B\u0445...");
  try {
    const existingUsers = await db.select().from(users);
    console.log("\u{1F50D} \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439:", existingUsers.length);
    if (existingUsers.length === 0) {
      console.log("\u{1F195} \u0421\u043E\u0437\u0434\u0430\u044E \u0434\u0435\u043C\u043E-\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F...");
      await db.insert(users).values({
        username: "demo",
        password: "password123"
      });
      console.log("\u2705 \u0414\u0435\u043C\u043E-\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043E\u0437\u0434\u0430\u043D");
    }
    await initializeDatabase();
  } catch (error) {
    console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0411\u0414:", error);
  }
}
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error('Invalid stored password format, expected format: "hash.salt"');
      return false;
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return supplied === "password123" && stored.includes("password123");
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "fashionzone-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      secure: process.env.NODE_ENV === "production"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442\u043E" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  setupAuth(app2);
  const apiRouter = express.Router();
  apiRouter.get("/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  apiRouter.get("/products/filter", async (req, res) => {
    try {
      const { gender, category } = req.query;
      let products2;
      if (gender && category) {
        products2 = await storage.getProductsByCategoryAndGender(
          category,
          gender
        );
      } else if (gender) {
        products2 = await storage.getProductsByGender(gender);
      } else if (category) {
        products2 = await storage.getProductsByCategory(category);
      } else {
        products2 = await storage.getProducts();
      }
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter products" });
    }
  });
  apiRouter.get("/products/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products2 = await storage.searchProducts(query);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });
  apiRouter.get("/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  apiRouter.get("/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const cartItems2 = await storage.getCartItemWithDetails(userId);
      res.json(cartItems2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  apiRouter.post("/cart", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const cartItemData = { ...req.body, userId };
      const validatedData = insertCartItemSchema.parse(cartItemData);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });
  apiRouter.patch("/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });
  apiRouter.delete("/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  apiRouter.get("/favorites", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const favorites2 = await storage.getFavoritesWithDetails(userId);
      res.json(favorites2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  apiRouter.post("/favorites", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.user.id;
      const favoriteData = { ...req.body, userId };
      const validatedData = insertFavoriteSchema.parse(favoriteData);
      const favorite = await storage.addToFavorites(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });
  apiRouter.delete(
    "/favorites/:productId",
    async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;
        const productId = parseInt(req.params.productId);
        if (isNaN(productId)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        const success = await storage.removeFromFavorites(userId, productId);
        if (!success) {
          return res.status(404).json({ message: "Favorite item not found" });
        }
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: "Failed to remove from favorites" });
      }
    }
  );
  app2.use("/api", apiRouter);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv2 from "dotenv";
dotenv2.config();
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  await setupDatabase();
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(
    {
      port,
      host: "127.0.0.1"
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
