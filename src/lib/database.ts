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
  // Enable automatic reconnection
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
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

  // Find brand by code
  findBrandByCode: async (brandCode: string) => {
    return await db.queryFirst("SELECT * FROM brands WHERE brand_code = ?", [
      brandCode,
    ]);
  },
};

export default db;
