const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  console.log('🔧 Tạo tài khoản admin...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : false,
    });

    console.log('✅ Kết nối database thành công!');
    
    // Admin account info
    const adminData = {
      fullName: 'GearHub Admin',
      email: 'gearhub@admin.com',
      password: '123456a',
      phoneNumber: '0123456789',
      role: 'ADMIN'
    };
    
    // Check if admin already exists
    const [existingUser] = await connection.execute(
      'SELECT user_id FROM users WHERE email = ?', 
      [adminData.email]
    );
    
    if (existingUser.length > 0) {
      console.log('⚠️ Admin đã tồn tại, cập nhật role...');
      
      // Update existing user to admin
      await connection.execute(
        'UPDATE users SET role = ?, is_active = 1 WHERE email = ?',
        ['ADMIN', adminData.email]
      );
      
      console.log('✅ Cập nhật role admin thành công!');
    } else {
      console.log('👤 Tạo tài khoản admin mới...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      // Insert admin user
      const [result] = await connection.execute(`
        INSERT INTO users (full_name, email, password_hash, phone_number, role, is_active, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
      `, [
        adminData.fullName,
        adminData.email,
        hashedPassword,
        adminData.phoneNumber,
        adminData.role
      ]);
      
      console.log('✅ Tạo admin thành công! User ID:', result.insertId);
    }
    
    // Verify admin account
    const [admin] = await connection.execute(
      'SELECT user_id, full_name, email, role, is_active FROM users WHERE email = ?',
      [adminData.email]
    );
    
    if (admin.length > 0) {
      console.log('\n📋 Thông tin admin:');
      console.log('   ID:', admin[0].user_id);
      console.log('   Tên:', admin[0].full_name);
      console.log('   Email:', admin[0].email);
      console.log('   Role:', admin[0].role);
      console.log('   Trạng thái:', admin[0].is_active ? 'Active' : 'Inactive');
      console.log('\n🎉 Có thể đăng nhập với:');
      console.log('   Email: gearhub@admin.com');
      console.log('   Password: 123456a');
    }
    
    await connection.end();
    console.log('\n🔚 Hoàn tất!');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.error('Chi tiết:', error);
  }
}

createAdmin(); 