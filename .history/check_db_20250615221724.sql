USE gear_shop;

-- Check products
SELECT 'Products count:' as info, COUNT(*) as count FROM products;
SELECT 'Active products:' as info, COUNT(*) as count FROM products WHERE is_active = 1;

-- Check structure
DESCRIBE order_items;

-- Sample products with price
SELECT product_id, product_name, price FROM products WHERE is_active = 1 LIMIT 3; 