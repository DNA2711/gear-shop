// Test Railway MySQL connection
// Run: node scripts/test-railway-connection.js

const mysql = require('mysql2/promise');
require('dotenv').config();

const railwayConfig = {
    host: process.env.DB_HOST || 'containers-us-west-xxx.railway.app',
    port: parseInt(process.env.DB_PORT || '6543'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your-password',
    database: process.env.DB_NAME || 'railway',
    ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
};

async function testConnection() {
    console.log('🚀 Testing Railway MySQL connection...');
    console.log('Config:', {
        host: railwayConfig.host,
        port: railwayConfig.port,
        user: railwayConfig.user,
        database: railwayConfig.database,
        password: '***hidden***'
    });

    try {
        // Create connection
        const connection = await mysql.createConnection(railwayConfig);

        // Test basic query
        const [rows] = await connection.execute('SELECT VERSION() as version, NOW() as current_time');
        console.log('✅ Connection successful!');
        console.log('MySQL Version:', rows[0].version);
        console.log('Server Time:', rows[0].current_time);

        // Test database structure
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`\n📋 Found ${tables.length} tables:`);
        tables.forEach((table, index) => {
            console.log(`${index + 1}. ${Object.values(table)[0]}`);
        });

        // Test sample data
        try {
            const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
            const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
            const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');

            console.log('\n📊 Data summary:');
            console.log(`Users: ${users[0].count}`);
            console.log(`Products: ${products[0].count}`);
            console.log(`Categories: ${categories[0].count}`);
        } catch (err) {
            console.log('\n⚠️ Some tables may not exist yet. Import your backup first.');
        }

        await connection.end();
        console.log('\n🎉 Railway database is ready for deployment!');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('\n💡 Check:');
        console.error('1. Railway credentials are correct');
        console.error('2. Railway service is running');
        console.error('3. Environment variables are set');
    }
}

testConnection(); 