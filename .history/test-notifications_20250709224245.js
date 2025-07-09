const mysql = require('mysql2/promise');

async function testNotifications() {
  // First check database
  console.log('🔍 Checking database for notifications...');
  const conn = await mysql.createConnection({
    host: 'caboose.proxy.rlwy.net',
    port: 29150,
    user: 'root',
    password: 'RTbPDjFprveDAFWcKaIjOpiFimetgWdR',
    database: 'railway',
    connectTimeout: 60000,
    acquireTimeout: 60000,
  });

  try {
    // Check if notifications table exists
    await conn.execute('DESCRIBE notifications');
    console.log('✅ Notifications table exists');
    
    // Check current notifications for user 8
    const [notifications] = await conn.execute(
      'SELECT * FROM notifications WHERE user_id = 8 ORDER BY created_at DESC'
    );
    
    console.log(`📊 User 8 has ${notifications.length} notifications`);
    
    if (notifications.length === 0) {
      console.log('📝 Adding sample notifications for user 8...');
      await conn.execute(`
        INSERT INTO notifications (user_id, title, message, type, category, is_read) VALUES
        (8, 'Chào mừng bạn đến với Gear Shop!', 'Cảm ơn bạn đã đăng ký tài khoản. Hãy khám phá hàng nghìn sản phẩm công nghệ chất lượng cao.', 'info', 'system', FALSE),
        (8, 'Khuyến mãi đặc biệt 🎉', 'Giảm giá 20% cho tất cả sản phẩm Gaming trong tuần này. Đừng bỏ lỡ cơ hội!', 'success', 'promotion', FALSE),
        (8, 'Cập nhật bảo mật ⚠️', 'Vui lòng cập nhật mật khẩu để đảm bảo tính bảo mật cho tài khoản của bạn.', 'warning', 'system', FALSE),
        (8, 'Sản phẩm mới ra mắt 🚀', 'Khám phá dòng sản phẩm RTX 4090 mới nhất với hiệu năng vượt trội!', 'info', 'promotion', FALSE),
        (8, 'Hệ thống bảo trì', 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai. Xin lỗi vì sự bất tiện.', 'warning', 'system', TRUE)
      `);
      console.log('✅ Sample notifications added!');
    } else {
      console.log('📋 Sample notifications:');
      notifications.slice(0, 3).forEach(notif => {
        console.log(`- ${notif.is_read ? '✓' : '●'} ${notif.title}`);
      });
    }
    
    // Check unread count
    const [unread] = await conn.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = 8 AND is_read = FALSE'
    );
    console.log(`🔔 ${unread[0].count} unread notifications`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await conn.end();
  
  // Test API
  console.log('\n🧪 Testing API...');
  try {
    const response = await fetch('http://localhost:3000/api/notifications?user_id=8');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:');
      console.log(`- Total: ${data.stats.total}`);
      console.log(`- Unread: ${data.stats.unread}`);
      console.log(`- Recent: ${data.stats.recent}`);
      console.log(`- Notifications count: ${data.notifications.length}`);
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ API Test failed:', error.message);
    console.log('Make sure the dev server is running (npm run dev)');
  }
}

testNotifications().catch(console.error); 