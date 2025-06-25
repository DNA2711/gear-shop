-- Sample data for Gear Shop graduation project
-- Run this after importing database structure

USE railway;

-- Insert sample categories
INSERT IGNORE INTO categories (category_id, name, description, status) VALUES
(1, 'Laptop', 'Máy tính xách tay', 'active'),
(2, 'PC Components', 'Linh kiện máy tính', 'active'),
(3, 'Gaming', 'Thiết bị gaming', 'active'),
(4, 'Mobile', 'Điện thoại di động', 'active'),
(5, 'Accessories', 'Phụ kiện công nghệ', 'active');

-- Insert sample brands
INSERT IGNORE INTO brands (brand_id, name, description, status) VALUES
(1, 'ASUS', 'ASUS Computer Hardware', 'active'),
(2, 'MSI', 'MSI Gaming Hardware', 'active'),
(3, 'Intel', 'Intel Processors', 'active'),
(4, 'AMD', 'AMD Processors and Graphics', 'active'),
(5, 'NVIDIA', 'NVIDIA Graphics Cards', 'active'),
(6, 'Samsung', 'Samsung Electronics', 'active'),
(7, 'Apple', 'Apple Products', 'active'),
(8, 'Dell', 'Dell Computers', 'active');

-- Insert admin user
INSERT IGNORE INTO users (user_id, email, full_name, password_hash, role, phone_number, address) VALUES
(1, 'admin@gearshop.com', 'Admin User', '$2a$10$example.admin.hash.here', 'admin', '0123456789', 'TP.HCM'),
(2, 'demo@gearshop.com', 'Demo Customer', '$2a$10$example.customer.hash.here', 'customer', '0987654321', 'Hà Nội');

-- Insert sample products for demo
INSERT IGNORE INTO products (product_id, name, description, price, category_id, brand_id, stock_quantity, status) VALUES
-- Laptops
(1, 'ASUS ROG Strix G15', 'Gaming laptop with RTX 3060, AMD Ryzen 7', 25000000, 1, 1, 10, 'active'),
(2, 'MSI GF63 Thin', 'Gaming laptop for students', 18000000, 1, 2, 15, 'active'),
(3, 'Dell XPS 13', 'Ultrabook for business', 30000000, 1, 8, 8, 'active'),

-- PC Components  
(4, 'Intel Core i7-13700K', 'Latest generation processor', 8500000, 2, 3, 20, 'active'),
(5, 'AMD Ryzen 7 7700X', 'High performance processor', 7800000, 2, 4, 18, 'active'),
(6, 'NVIDIA RTX 4070', 'High-end graphics card', 15000000, 2, 5, 12, 'active'),
(7, 'ASUS ROG Strix B650-F', 'Gaming motherboard', 5500000, 2, 1, 15, 'active'),

-- Gaming
(8, 'ASUS ROG Azoth', 'Mechanical gaming keyboard', 4500000, 3, 1, 25, 'active'),
(9, 'MSI Clutch GM41', 'Gaming mouse with RGB', 1200000, 3, 2, 30, 'active'),

-- Mobile
(10, 'Samsung Galaxy S24 Ultra', 'Latest flagship smartphone', 28000000, 4, 6, 20, 'active'),
(11, 'iPhone 15 Pro Max', 'Apple flagship smartphone', 32000000, 4, 7, 15, 'active');

-- Insert sample product images (placeholder URLs)
INSERT IGNORE INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(1, '/images/products/asus-rog-strix-g15.jpg', 'ASUS ROG Strix G15', 1),
(2, '/images/products/msi-gf63.jpg', 'MSI GF63 Thin', 1),
(3, '/images/products/dell-xps13.jpg', 'Dell XPS 13', 1),
(4, '/images/products/intel-i7-13700k.jpg', 'Intel Core i7-13700K', 1),
(5, '/images/products/amd-ryzen7-7700x.jpg', 'AMD Ryzen 7 7700X', 1),
(6, '/images/products/rtx-4070.jpg', 'NVIDIA RTX 4070', 1),
(10, '/images/products/samsung-s24-ultra.jpg', 'Samsung Galaxy S24 Ultra', 1),
(11, '/images/products/iphone-15-pro-max.jpg', 'iPhone 15 Pro Max', 1);

-- Insert sample order for demo
INSERT IGNORE INTO orders (order_id, user_id, total_amount, status, payment_status, payment_method, shipping_address) VALUES
(1, 2, 43000000, 'delivered', 'paid', 'credit_card', '123 Nguyễn Văn A, Quận 1, TP.HCM');

-- Insert order items
INSERT IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 25000000),  -- ASUS ROG Strix G15
(1, 6, 1, 15000000),  -- RTX 4070
(1, 8, 1, 4500000);   -- Gaming keyboard

-- Create specifications table if it exists
-- INSERT IGNORE INTO specifications (product_id, spec_name, spec_value) VALUES
-- (1, 'CPU', 'AMD Ryzen 7 6800H'),
-- (1, 'GPU', 'NVIDIA RTX 3060'),
-- (1, 'RAM', '16GB DDR5'),
-- (1, 'Storage', '512GB SSD');

SELECT 'Sample data inserted successfully!' as message;
SELECT 'Total products:', COUNT(*) as count FROM products;
SELECT 'Total categories:', COUNT(*) as count FROM categories;
SELECT 'Total users:', COUNT(*) as count FROM users; 