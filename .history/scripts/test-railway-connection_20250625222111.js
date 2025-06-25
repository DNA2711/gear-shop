// Test Railway MySQL connection
// Run: node scripts/test-railway-connection.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔄 Testing Railway MySQL connection...');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
        });

        console.log('✅ Connection successful!');
        console.log(`📍 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`🗃️  Database: ${process.env.DB_NAME}`);
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection(); 