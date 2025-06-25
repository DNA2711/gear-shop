const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing Railway MySQL connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    });

    console.log('✅ Connected to Railway MySQL successfully!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('📊 Users count:', rows[0].count);
    
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log('📊 Categories count:', categories[0].count);
    
    await connection.end();
    console.log('🔚 Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
}

testConnection(); 