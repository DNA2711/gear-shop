import mysql from "mysql2/promise";

// Database configuration based on Spring Boot application.properties
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "gear_shop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // MySQL2 pool options
  idleTimeout: 60000,
  acquireTimeout: 60000,
  // Character set for Vietnamese support
  charset: "utf8mb4",
  timezone: "+00:00",
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

export class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = pool;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Execute query with parameters
  public async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as any[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  // Execute raw query without prepared statements (for compatibility issues)
  public async queryRaw(sql: string): Promise<any[]> {
    try {
      const [rows] = await this.pool.query(sql);
      return rows as any[];
    } catch (error) {
      console.error("Database raw query error:", error);
      throw error;
    }
  }

  // Execute query and return first row
  public async queryFirst(sql: string, params?: any[]): Promise<any | null> {
    const rows = await this.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  // Execute insert query and return insertId
  public async insert(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return (result as any).insertId;
    } catch (error) {
      console.error("Database insert error:", error);
      throw error;
    }
  }

  // Execute update/delete query and return affected rows
  public async update(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return (result as any).affectedRows;
    } catch (error) {
      console.error("Database update error:", error);
      throw error;
    }
  }

  // Begin transaction
  public async beginTransaction(): Promise<mysql.PoolConnection> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  // Commit transaction
  public async commitTransaction(
    connection: mysql.PoolConnection
  ): Promise<void> {
    await connection.commit();
    connection.release();
  }

  // Rollback transaction
  public async rollbackTransaction(
    connection: mysql.PoolConnection
  ): Promise<void> {
    await connection.rollback();
    connection.release();
  }

  // Test connection
  public async testConnection(): Promise<boolean> {
    try {
      await this.query("SELECT 1");
      return true;
    } catch (error) {
      console.error("Database connection test failed:", error);
      return false;
    }
  }

  // Close pool
  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Export singleton instance
export const db = Database.getInstance();

// Helper function for common queries
export const dbHelpers = {
  // Core database methods
  query: async (sql: string, params?: any[]): Promise<any[]> => {
    return await db.query(sql, params);
  },

  queryFirst: async (sql: string, params?: any[]): Promise<any | null> => {
    return await db.queryFirst(sql, params);
  },

  insert: async (sql: string, params?: any[]): Promise<number> => {
    return await db.insert(sql, params);
  },

  update: async (sql: string, params?: any[]): Promise<number> => {
    return await db.update(sql, params);
  },

  // Find user by email
  findUserByEmail: async (email: string) => {
    return await db.queryFirst("SELECT * FROM users WHERE email = ?", [email]);
  },

  // Find user by username (email)
  findUserByUsername: async (username: string) => {
    return await db.queryFirst("SELECT * FROM users WHERE email = ?", [
      username,
    ]);
  },

  // Find user by ID
  findUserById: async (id: number) => {
    return await db.queryFirst("SELECT * FROM users WHERE user_id = ?", [id]);
  },

  // Create new user
  createUser: async (userData: {
    fullName: string;
    email: string;
    passwordHash: string;
    phoneNumber?: string;
    address?: string;
    role?: string;
  }) => {
    const { fullName, email, passwordHash, phoneNumber, address, role } =
      userData;
    return await db.insert(
      `INSERT INTO users (full_name, email, password_hash, phone_number, address, role, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [fullName, email, passwordHash, phoneNumber, address, role || "USER"]
    );
  },

  // Update user
  updateUser: async (
    id: number,
    userData: Partial<{
      fullName: string;
      email: string;
      phoneNumber: string;
      address: string;
      role: string;
    }>
  ) => {
    const fields = Object.keys(userData).filter(
      (key) => userData[key as keyof typeof userData] !== undefined
    );
    if (fields.length === 0) return 0;

    const setClause = fields
      .map((field) => {
        const dbField =
          field === "fullName"
            ? "full_name"
            : field === "phoneNumber"
            ? "phone_number"
            : field === "passwordHash"
            ? "password_hash"
            : field;
        return `${dbField} = ?`;
      })
      .join(", ");

    const values: any[] = fields.map(
      (field) => userData[field as keyof typeof userData]
    );
    values.push(id);

    return await db.update(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      values
    );
  },

  // Find all brands with logos
  findBrandsWithLogos: async () => {
    return await db.query(`
      SELECT 
        brand_id,
        brand_code,
        brand_name,
        website,
        logo_code as base64_logo,
        CASE 
          WHEN logo_code LIKE 'data:image/svg+xml;base64,%' THEN 'SVG'
          WHEN logo_code LIKE 'data:image/png;base64,%' THEN 'PNG'
          WHEN logo_code LIKE 'data:image/jpeg;base64,%' THEN 'JPEG'
          WHEN logo_code LIKE 'data:image/jpg;base64,%' THEN 'JPG'
          WHEN logo_code LIKE 'data:image/gif;base64,%' THEN 'GIF'
          WHEN logo_code LIKE 'data:image/webp;base64,%' THEN 'WebP'
          ELSE 'Unknown'
        END as image_format,
        LENGTH(logo_code) as file_size_bytes
      FROM brands 
      WHERE logo_code IS NOT NULL 
      ORDER BY brand_name
    `);
  },

  // Find brand by ID
  findBrandById: async (brandId: number) => {
    return await db.queryFirst("SELECT * FROM brands WHERE brand_id = ?", [
      brandId,
    ]);
  },

  // Find brand by code
  findBrandByCode: async (brandCode: string) => {
    return await db.queryFirst("SELECT * FROM brands WHERE brand_code = ?", [
      brandCode,
    ]);
  },

  // Category helpers
  // Find all categories
  findAllCategories: async () => {
    return await db.query(`
      SELECT 
        c.*,
        COUNT(p.product_id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id AND p.is_active = TRUE
      GROUP BY c.category_id
      ORDER BY c.parent_id ASC, c.category_name ASC
    `);
  },

  // Find category by ID
  findCategoryById: async (categoryId: number) => {
    return await db.queryFirst(
      `
      SELECT 
        c.*,
        COUNT(p.product_id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id AND p.is_active = TRUE
      WHERE c.category_id = ?
      GROUP BY c.category_id
    `,
      [categoryId]
    );
  },

  // Find category by code
  findCategoryByCode: async (categoryCode: string) => {
    return await db.queryFirst(
      "SELECT * FROM categories WHERE category_code = ?",
      [categoryCode]
    );
  },

  // Check if category code exists (for validation)
  categoryCodeExists: async (categoryCode: string, excludeId?: number) => {
    let sql = "SELECT category_id FROM categories WHERE category_code = ?";
    let params: any[] = [categoryCode];

    if (excludeId) {
      sql += " AND category_id != ?";
      params.push(excludeId);
    }

    const result = await db.queryFirst(sql, params);
    return !!result;
  },

  // Create new category
  createCategory: async (categoryData: {
    category_name: string;
    category_code: string;
    parent_id?: number;
    is_active?: boolean;
  }) => {
    const { category_name, category_code, parent_id, is_active } = categoryData;
    return await db.insert(
      `INSERT INTO categories (category_name, category_code, parent_id, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [category_name, category_code, parent_id, is_active ?? true]
    );
  },

  // Update category
  updateCategory: async (
    categoryId: number,
    categoryData: Partial<{
      category_name: string;
      category_code: string;
      parent_id: number;
      is_active: boolean;
    }>
  ) => {
    const fields = Object.keys(categoryData).filter(
      (key) => categoryData[key as keyof typeof categoryData] !== undefined
    );
    if (fields.length === 0) return 0;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values: any[] = fields.map(
      (field) => categoryData[field as keyof typeof categoryData]
    );
    values.push(categoryId);

    return await db.update(
      `UPDATE categories SET ${setClause}, updated_at = NOW() WHERE category_id = ?`,
      values
    );
  },

  // Delete category (soft delete by setting is_active = false)
  deleteCategory: async (categoryId: number) => {
    return await db.update(
      "UPDATE categories SET is_active = FALSE, updated_at = NOW() WHERE category_id = ?",
      [categoryId]
    );
  },

  // Hard delete category (only if no products are associated)
  hardDeleteCategory: async (categoryId: number) => {
    // First check if category has products
    const productCount = await db.queryFirst(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [categoryId]
    );

    if (productCount && productCount.count > 0) {
      throw new Error("Cannot delete category with associated products");
    }

    // Check if category has child categories
    const childCount = await db.queryFirst(
      "SELECT COUNT(*) as count FROM categories WHERE parent_id = ?",
      [categoryId]
    );

    if (childCount && childCount.count > 0) {
      throw new Error("Cannot delete category with child categories");
    }

    return await db.update("DELETE FROM categories WHERE category_id = ?", [
      categoryId,
    ]);
  },

  // Toggle category status
  toggleCategoryStatus: async (categoryId: number) => {
    return await db.update(
      "UPDATE categories SET is_active = NOT is_active, updated_at = NOW() WHERE category_id = ?",
      [categoryId]
    );
  },

  // Get categories hierarchy
  getCategoriesHierarchy: async () => {
    const categories = await db.query(`
      SELECT 
        c.*,
        COUNT(p.product_id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.category_id
      ORDER BY c.parent_id ASC, c.category_name ASC
    `);

    // Build hierarchy
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // First pass: create map of all categories
    categories.forEach((category: any) => {
      categoryMap.set(category.category_id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach((category: any) => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.category_id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.category_id));
      }
    });

    return rootCategories;
  },

  // Product helpers
  // Find all products with details
  findAllProducts: async (filters?: {
    search?: string;
    brand_id?: number;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    let sql = `
      SELECT 
        p.*,
        b.brand_name,
        b.brand_code,
        c.category_name,
        c.category_code,
        pc.category_name as category_parent_name,
        pri.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      LEFT JOIN product_images pri ON p.product_id = pri.product_id AND pri.is_primary = TRUE
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.search) {
      sql += ` AND (p.product_name LIKE ? OR p.product_code LIKE ? OR b.brand_name LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters?.brand_id) {
      sql += ` AND p.brand_id = ?`;
      params.push(filters.brand_id);
    }

    if (filters?.category_id) {
      sql += ` AND p.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters?.min_price) {
      sql += ` AND p.price >= ?`;
      params.push(filters.min_price);
    }

    if (filters?.max_price) {
      sql += ` AND p.price <= ?`;
      params.push(filters.max_price);
    }

    if (filters?.is_active !== undefined) {
      sql += ` AND p.is_active = ?`;
      params.push(filters.is_active);
    }

    // Sorting - validate sort_by to prevent SQL injection
    const allowedSortFields = [
      "product_name",
      "price",
      "stock_quantity",
      "created_at",
    ];
    const sortBy = allowedSortFields.includes(filters?.sort_by || "")
      ? filters?.sort_by
      : "product_name";
    const sortOrder = filters?.sort_order === "desc" ? "DESC" : "ASC";
    sql += ` ORDER BY p.${sortBy} ${sortOrder}`;

    // Pagination
    if (filters?.limit && filters.limit > 0) {
      const offset = ((filters.page || 1) - 1) * filters.limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(filters.limit, offset);
    }

    return await db.query(sql, params);
  },

  // Count products for pagination
  countProducts: async (filters?: {
    search?: string;
    brand_id?: number;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    is_active?: boolean;
  }) => {
    let sql = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.search) {
      sql += ` AND (p.product_name LIKE ? OR p.product_code LIKE ? OR b.brand_name LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters?.brand_id) {
      sql += ` AND p.brand_id = ?`;
      params.push(filters.brand_id);
    }

    if (filters?.category_id) {
      sql += ` AND p.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters?.min_price) {
      sql += ` AND p.price >= ?`;
      params.push(filters.min_price);
    }

    if (filters?.max_price) {
      sql += ` AND p.price <= ?`;
      params.push(filters.max_price);
    }

    if (filters?.is_active !== undefined) {
      sql += ` AND p.is_active = ?`;
      params.push(filters.is_active);
    }

    const result = await db.queryFirst(sql, params);
    return result?.total || 0;
  },

  // Find product by ID
  findProductById: async (productId: number) => {
    // First get the product details
    const product = await db.queryFirst(
      `
      SELECT 
        p.*,
        b.brand_name,
        b.brand_code,
        c.category_name,
        c.category_code,
        pc.category_name as category_parent_name,
        pri.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      LEFT JOIN product_images pri ON p.product_id = pri.product_id AND pri.is_primary = TRUE
      WHERE p.product_id = ?
    `,
      [productId]
    );

    if (!product) return null;

    // Get all images for this product
    const images = await db.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC",
      [productId]
    );

    // Get all specifications for this product
    const specifications = await db.query(
      "SELECT spec_name, spec_value FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC",
      [productId]
    );

    return {
      ...product,
      images: images || [],
      specifications: specifications || [],
    };
  },

  // Find product by code
  findProductByCode: async (productCode: string) => {
    return await db.queryFirst(
      "SELECT * FROM products WHERE product_code = ?",
      [productCode]
    );
  },

  // Check if product code exists (for validation)
  productCodeExists: async (productCode: string, excludeId?: number) => {
    let sql = "SELECT product_id FROM products WHERE product_code = ?";
    let params: any[] = [productCode];

    if (excludeId) {
      sql += " AND product_id != ?";
      params.push(excludeId);
    }

    console.log("productCodeExists - SQL:", sql);
    console.log("productCodeExists - Params:", params);

    const result = await db.queryFirst(sql, params);
    console.log("productCodeExists - Result:", result);

    return !!result;
  },

  // Create new product
  createProduct: async (productData: {
    product_name: string;
    product_code: string;
    brand_id?: number;
    category_id?: number;
    price: number;
    stock_quantity?: number;
    is_active?: boolean;
  }) => {
    const {
      product_name,
      product_code,
      brand_id,
      category_id,
      price,
      stock_quantity,
      is_active,
    } = productData;

    return await db.insert(
      `INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        product_name,
        product_code,
        brand_id,
        category_id,
        price,
        stock_quantity || 0,
        is_active ?? true,
      ]
    );
  },

  // Update product
  updateProduct: async (
    productId: number,
    productData: Partial<{
      product_name: string;
      product_code: string;
      brand_id: number;
      category_id: number;
      price: number;
      stock_quantity: number;
      is_active: boolean;
    }>
  ) => {
    const fields = Object.keys(productData).filter(
      (key) => productData[key as keyof typeof productData] !== undefined
    );
    if (fields.length === 0) return 0;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values: any[] = fields.map(
      (field) => productData[field as keyof typeof productData]
    );
    values.push(productId);

    return await db.update(
      `UPDATE products SET ${setClause}, updated_at = NOW() WHERE product_id = ?`,
      values
    );
  },

  // Delete product (soft delete by setting is_active = false)
  deleteProduct: async (productId: number) => {
    return await db.update(
      "UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE product_id = ?",
      [productId]
    );
  },

  // Hard delete product
  hardDeleteProduct: async (productId: number) => {
    return await db.update("DELETE FROM products WHERE product_id = ?", [
      productId,
    ]);
  },

  // Toggle product status
  toggleProductStatus: async (productId: number) => {
    return await db.update(
      "UPDATE products SET is_active = NOT is_active, updated_at = NOW() WHERE product_id = ?",
      [productId]
    );
  },

  // Update product stock
  updateProductStock: async (productId: number, quantity: number) => {
    return await db.update(
      "UPDATE products SET stock_quantity = ?, updated_at = NOW() WHERE product_id = ?",
      [quantity, productId]
    );
  },

  // ========== PRODUCT IMAGES FUNCTIONS ==========

  // Find all images for a product
  findProductImages: async (productId: number) => {
    return await db.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC",
      [productId]
    );
  },

  // Find primary image for a product
  findProductPrimaryImage: async (productId: number) => {
    return await db.queryFirst(
      "SELECT * FROM product_images WHERE product_id = ? AND is_primary = TRUE",
      [productId]
    );
  },

  // Add image to product
  addProductImage: async (imageData: {
    product_id: number;
    image_name: string;
    image_code: string;
    is_primary?: boolean;
    display_order?: number;
  }) => {
    const {
      product_id,
      image_name,
      image_code,
      is_primary = false,
      display_order = 0,
    } = imageData;

    // Nếu đây là ảnh chính, đảm bảo không có ảnh chính nào khác
    if (is_primary) {
      await db.update(
        "UPDATE product_images SET is_primary = FALSE WHERE product_id = ?",
        [product_id]
      );
    }

    return await db.insert(
      `INSERT INTO product_images (product_id, image_name, image_code, is_primary, display_order, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [product_id, image_name, image_code, is_primary, display_order]
    );
  },

  // Update product image
  updateProductImage: async (
    imageId: number,
    imageData: Partial<{
      image_name: string;
      image_code: string;
      is_primary: boolean;
      display_order: number;
    }>
  ) => {
    const fields = Object.keys(imageData).filter(
      (key) => imageData[key as keyof typeof imageData] !== undefined
    );
    if (fields.length === 0) return 0;

    // Nếu đây là ảnh chính, đảm bảo không có ảnh chính nào khác
    if (imageData.is_primary) {
      const image = await db.queryFirst(
        "SELECT product_id FROM product_images WHERE image_id = ?",
        [imageId]
      );
      if (image) {
        await db.update(
          "UPDATE product_images SET is_primary = FALSE WHERE product_id = ? AND image_id != ?",
          [image.product_id, imageId]
        );
      }
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values: any[] = fields.map(
      (field) => imageData[field as keyof typeof imageData]
    );
    values.push(imageId);

    return await db.update(
      `UPDATE product_images SET ${setClause}, updated_at = NOW() WHERE image_id = ?`,
      values
    );
  },

  // Delete product image
  deleteProductImage: async (imageId: number) => {
    return await db.update("DELETE FROM product_images WHERE image_id = ?", [
      imageId,
    ]);
  },

  // Set primary image for product
  setProductPrimaryImage: async (productId: number, imageId: number) => {
    // Đảm bảo chỉ có 1 ảnh chính
    await db.update(
      "UPDATE product_images SET is_primary = FALSE WHERE product_id = ?",
      [productId]
    );

    return await db.update(
      "UPDATE product_images SET is_primary = TRUE, updated_at = NOW() WHERE image_id = ? AND product_id = ?",
      [imageId, productId]
    );
  },

  // Delete all images for a product
  deleteAllProductImages: async (productId: number) => {
    return await db.update("DELETE FROM product_images WHERE product_id = ?", [
      productId,
    ]);
  },

  // ========== PRODUCT SPECIFICATIONS FUNCTIONS ==========

  // Add specification to product
  addProductSpecification: async (specData: {
    product_id: number;
    spec_name: string;
    spec_value: string;
    display_order?: number;
  }) => {
    const { product_id, spec_name, spec_value, display_order = 0 } = specData;

    return await db.insert(
      `INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [product_id, spec_name, spec_value, display_order]
    );
  },

  // Update product specification
  updateProductSpecification: async (
    specId: number,
    specData: Partial<{
      spec_name: string;
      spec_value: string;
      display_order: number;
    }>
  ) => {
    const fields = Object.keys(specData).filter(
      (key) => specData[key as keyof typeof specData] !== undefined
    );
    if (fields.length === 0) return 0;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values: any[] = fields.map(
      (field) => specData[field as keyof typeof specData]
    );
    values.push(specId);

    return await db.update(
      `UPDATE product_specifications SET ${setClause}, updated_at = NOW() WHERE spec_id = ?`,
      values
    );
  },

  // Delete product specification
  deleteProductSpecification: async (specId: number) => {
    return await db.update(
      "DELETE FROM product_specifications WHERE spec_id = ?",
      [specId]
    );
  },

  // Delete all specifications for a product
  deleteAllProductSpecifications: async (productId: number) => {
    return await db.update(
      "DELETE FROM product_specifications WHERE product_id = ?",
      [productId]
    );
  },

  // Get all images for a product
  getProductImages: async (productId: number) => {
    return await db.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC",
      [productId]
    );
  },

  // Get all specifications for a product
  getProductSpecifications: async (productId: number) => {
    return await db.query(
      "SELECT * FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC",
      [productId]
    );
  },

  // Get specification by spec_id
  getProductSpecificationById: async (specId: number) => {
    return await db.queryFirst(
      "SELECT * FROM product_specifications WHERE spec_id = ?",
      [specId]
    );
  },

  // Delete user by ID
  deleteUser: async (userId: number) => {
    return await db.update("DELETE FROM users WHERE user_id = ?", [userId]);
  },
};

export default db;
