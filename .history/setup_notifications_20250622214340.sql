-- =====================================
-- SETUP NOTIFICATION SYSTEM
-- =====================================

USE gear_shop;

-- Run the notifications table creation
SOURCE database/create_notifications_table.sql;

-- Tạo một số sample notifications để test (optional)
INSERT INTO notifications (user_id, order_id, type, title, message, status_from, status_to, is_read) 
SELECT 
    1 as user_id,
    1 as order_id,
    'order_status' as type,
    'Đơn hàng đang được xử lý' as title,
    'Đơn hàng #1 của bạn đã được xác nhận và đang trong quá trình xử lý. Chúng tôi sẽ sớm chuẩn bị hàng và giao đến bạn.' as message,
    'paid' as status_from,
    'processing' as status_to,
    FALSE as is_read
WHERE EXISTS (SELECT 1 FROM users WHERE user_id = 1)
AND EXISTS (SELECT 1 FROM orders WHERE id = 1)
LIMIT 1;

-- Kiểm tra kết quả
SELECT 'Notification system setup completed!' as status;
SELECT COUNT(*) as notification_count FROM notifications;
SELECT 
    type,
    COUNT(*) as count,
    SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_count
FROM notifications 
GROUP BY type; 