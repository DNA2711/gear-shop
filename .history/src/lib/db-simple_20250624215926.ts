import { promises as fs } from "fs";
import path from "path";

// Simple file-based database for demo/development
// For production, use proper database service

interface User {
  user_id: number;
  email: string;
  full_name: string;
  password_hash: string;
  phone_number?: string;
  address?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  brand_id: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Database helpers for demo
export const demoDb = {
  // Users
  async getUsers(): Promise<User[]> {
    return readJsonFile<User>("users.json");
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.email === email) || null;
  },

  async getUserById(id: number): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.user_id === id) || null;
  },

  async createUser(
    userData: Omit<User, "user_id" | "created_at" | "updated_at">
  ): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...userData,
      user_id: users.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJsonFile("users.json", users);
    return newUser;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return readJsonFile<Product>("products.json");
  },

  async getProductById(id: number): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.product_id === id) || null;
  },

  async createProduct(
    productData: Omit<Product, "product_id" | "created_at" | "updated_at">
  ): Promise<Product> {
    const products = await this.getProducts();
    const newProduct: Product = {
      ...productData,
      product_id: products.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    products.push(newProduct);
    await writeJsonFile("products.json", products);
    return newProduct;
  },

  // Orders, Categories, etc. - implement as needed
};

// Initialize with sample data if empty
export async function initSampleData() {
  const users = await demoDb.getUsers();
  if (users.length === 0) {
    await demoDb.createUser({
      email: "admin@gearshop.com",
      full_name: "Admin User",
      password_hash: "$2a$10$example.hash.here",
      role: "admin",
      phone_number: "0123456789",
      address: "Admin Address",
    });
  }

  const products = await demoDb.getProducts();
  if (products.length === 0) {
    await demoDb.createProduct({
      name: "Sample Laptop",
      description: "Demo laptop for graduation project",
      price: 15000000,
      category_id: 1,
      brand_id: 1,
      stock_quantity: 10,
    });
  }
}
