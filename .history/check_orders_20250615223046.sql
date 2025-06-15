USE gear_shop;

-- Check recent orders
SELECT 'Recent Orders:' as info;
SELECT id, user_id, total_amount, status, shipping_address, phone_number, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Check order items
SELECT 'Order Items:' as info;
SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.product_name
FROM order_items oi 
LEFT JOIN products p ON oi.product_id = p.product_id
ORDER BY oi.id DESC 
LIMIT 10; 