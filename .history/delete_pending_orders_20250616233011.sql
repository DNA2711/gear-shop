-- Script để xóa các đơn hàng có trạng thái pending
-- Chạy script này để dọn dẹp dữ liệu

USE gear_shop;

-- Hiển thị số lượng đơn hàng pending trước khi xóa
SELECT 
    COUNT(*) as total_pending_orders,
    SUM(total_amount) as total_pending_amount
FROM orders 
WHERE status = 'pending';

-- Hiển thị chi tiết các đơn hàng pending
SELECT 
    id,
    user_id,
    total_amount,
    status,
    created_at,
    shipping_address
FROM orders 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Xóa các order_items của đơn hàng pending trước (do foreign key constraint)
DELETE oi FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'pending';

-- Xóa các đơn hàng pending
DELETE FROM orders 
WHERE status = 'pending';

-- Kiểm tra kết quả sau khi xóa
SELECT 
    COUNT(*) as remaining_pending_orders
FROM orders 
WHERE status = 'pending';

-- Hiển thị thống kê đơn hàng còn lại
SELECT 
    status,
    COUNT(*) as count,
    SUM(total_amount) as total_amount
FROM orders 
GROUP BY status
ORDER BY count DESC; 