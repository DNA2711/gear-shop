import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export a function to execute queries
export const db = {
  query: async (sql: string, params?: any[]) => {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },
}; 