const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  console.log('🔍 Kiểm tra Database Railway MySQL...');
  console.log('================================');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('================================\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    });

    console.log('✅ Kết nối thành công!\n');
    
    // Check các bảng chính
    const tables = [
      'users',
      'categories', 
      'brands',
      'products',
      'orders',
      'notifications'
    ];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table không tồn tại hoặc lỗi`);
      }
    }
    
    console.log('\n🔍 Kiểm tra charset:');
    const [charset] = await connection.execute(`
      SELECT table_name, table_collation 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name IN ('users', 'categories', 'products')
    `, [process.env.DB_NAME]);
    
    charset.forEach(row => {
      console.log(`   ${row.table_name}: ${row.table_collation}`);
    });
    
    console.log('\n🔍 Kiểm tra categories mẫu:');
    const [sampleCategories] = await connection.execute(`
      SELECT category_name, category_code 
      FROM categories 
      WHERE parent_id IS NULL 
      LIMIT 5
    `);
    
    sampleCategories.forEach(cat => {
      console.log(`   ${cat.category_code}: ${cat.category_name}`);
    });
    
    await connection.end();
    console.log('\n🔚 Hoàn tất kiểm tra database');
    
  } catch (error) {
    console.error('❌ Kết nối thất bại:', error.message);
    console.error('Chi tiết lỗi:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
}

checkDatabase(); 