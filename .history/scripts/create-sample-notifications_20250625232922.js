const mysql = require('mysql2/promise');

// Railway connection details
const connectionConfig = {
    host: 'caboose.proxy.rlwy.net',
    port: 29150,
    user: 'root',
    password: 'RTbPDjFprveDAFWcKaIjOpiFimetgWdR',
    database: 'railway',
    charset: 'utf8mb4'
};

async function createSampleNotifications() {
    let connection;

    try {
        console.log('🔗 Kết nối tới Railway database...');
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Kết nối thành công!');

        // Sample notifications for admin user (ID: 8)
        const notifications = [
            {
                user_id: 8,
                title: 'Chào mừng đến với GearHub',
                message: 'Chào mừng bạn đến với hệ thống quản trị GearHub. Bạn có thể bắt đầu quản lý sản phẩm, đơn hàng và khách hàng.',
                type: 'success',
                category: 'system',
                is_read: false
            },
            {
                user_id: 8,
                title: 'Có đơn hàng mới',
                message: 'Có 1 đơn hàng mới cần được xử lý. Vui lòng kiểm tra trong mục quản lý đơn hàng.',
                type: 'info',
                category: 'admin_new_order',
                is_read: false
            },
            {
                user_id: 8,
                title: 'Cập nhật hệ thống',
                message: 'Hệ thống đã được cập nhật với các tính năng mới. Kiểm tra changelog để biết thêm chi tiết.',
                type: 'info',
                category: 'system',
                is_read: true
            },
            {
                user_id: 8,
                title: 'Khuyến mãi Black Friday',
                message: 'Chương trình khuyến mãi Black Friday đã bắt đầu! Giảm giá lên đến 50% cho tất cả sản phẩm.',
                type: 'success',
                category: 'promotion',
                is_read: false
            },
            {
                user_id: 8,
                title: 'Lỗi thanh toán',
                message: 'Có lỗi xảy ra trong quá trình xử lý thanh toán đơn hàng #ORD001. Vui lòng kiểm tra.',
                type: 'error',
                category: 'payment_failed',
                is_read: false
            }
        ];

        console.log(`🔄 Thêm ${notifications.length} notifications mẫu...`);

        for (const notification of notifications) {
            const insertQuery = `
        INSERT INTO notifications (user_id, title, message, type, category, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

            const [result] = await connection.execute(insertQuery, [
                notification.user_id,
                notification.title,
                notification.message,
                notification.type,
                notification.category,
                notification.is_read
            ]);

            console.log(`✅ Đã thêm: "${notification.title}" (ID: ${result.insertId})`);
        }

        // Kiểm tra kết quả
        const [countResult] = await connection.execute(
            'SELECT COUNT(*) as total FROM notifications WHERE user_id = 8'
        );

        console.log(`\n🎉 Hoàn tất! Đã có ${countResult[0].total} notifications cho admin user.`);

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Đã đóng kết nối database.');
        }
    }
}

createSampleNotifications(); 