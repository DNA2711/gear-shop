const mysql = require('mysql2/promise');

async function checkNotificationsTable() {
  const conn = await mysql.createConnection({
    host: 'localhost', 
    port: 3306, 
    user: 'root', 
    password: '123456', 
    database: 'gear_shop'
  });
  
  console.log('=== CHECKING NOTIFICATIONS TABLE ===');
  try {
    const [schema] = await conn.execute('DESCRIBE notifications');
    console.log('✅ Table exists! Structure:');
    schema.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type}${col.Null === 'NO' ? ' NOT NULL' : ''}${col.Key ? ` (${col.Key})` : ''}`);
    });
    
    console.log('\n=== CHECKING DATA ===');
    const [count] = await conn.execute('SELECT COUNT(*) as total FROM notifications');
    console.log(`Total notifications: ${count[0].total}`);
    
    if (count[0].total > 0) {
      const [sample] = await conn.execute('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 3');
      console.log('\nSample notifications:');
      sample.forEach(notif => {
        console.log(`- ID: ${notif.notification_id}, User: ${notif.user_id}, Title: ${notif.title}`);
      });
    } else {
      console.log('📝 Creating sample notifications...');
      await conn.execute(`
        INSERT INTO notifications (user_id, title, message, type, category) VALUES
        (8, 'Chào mừng bạn đến với Gear Shop!', 'Cảm ơn bạn đã đăng ký tài khoản. Hãy khám phá hàng nghìn sản phẩm công nghệ chất lượng cao.', 'info', 'system'),
        (8, 'Khuyến mãi đặc biệt!', 'Giảm giá 20% cho tất cả sản phẩm Gaming trong tuần này. Đừng bỏ lỡ cơ hội!', 'success', 'promotion'),
        (8, 'Cập nhật bảo mật', 'Vui lòng cập nhật mật khẩu để đảm bảo tính bảo mật cho tài khoản của bạn.', 'warning', 'system')
      `);
      console.log('✅ Sample notifications created!');
    }
  } catch (error) {
    console.log('❌ Table does not exist. Creating notifications table...');
    await conn.execute(`
      CREATE TABLE notifications (
        notification_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
        category ENUM('order_created', 'order_updated', 'order_delivered', 'order_cancelled', 
                     'payment_success', 'payment_failed', 'admin_new_order', 'system', 'promotion') DEFAULT 'system',
        data JSON NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Notifications table created successfully!');
    
    console.log('📝 Adding sample notifications...');
    await conn.execute(`
      INSERT INTO notifications (user_id, title, message, type, category) VALUES
      (8, 'Chào mừng bạn đến với Gear Shop!', 'Cảm ơn bạn đã đăng ký tài khoản. Hãy khám phá hàng nghìn sản phẩm công nghệ chất lượng cao.', 'info', 'system'),
      (8, 'Khuyến mãi đặc biệt!', 'Giảm giá 20% cho tất cả sản phẩm Gaming trong tuần này. Đừng bỏ lỡ cơ hội!', 'success', 'promotion'),
      (8, 'Cập nhật bảo mật', 'Vui lòng cập nhật mật khẩu để đảm bảo tính bảo mật cho tài khoản của bạn.', 'warning', 'system')
    `);
    console.log('✅ Sample notifications created!');
  }
  
  await conn.end();
}

checkNotificationsTable().catch(console.error); 