-- =====================================
-- THÊM DỮ LIỆU SẢN PHẨM MẪU
-- =====================================

USE gear_shop;

-- Xóa dữ liệu cũ nếu có
TRUNCATE TABLE products;

-- Thêm sản phẩm CPU Intel
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('Intel Core i9-13900K', 'intel-i9-13900k', 
 (SELECT brand_id FROM brands WHERE brand_code = 'intel'), 
 (SELECT category_id FROM categories WHERE category_code = 'intel-cpu'), 
 13990000, 15, TRUE),

('Intel Core i7-13700K', 'intel-i7-13700k', 
 (SELECT brand_id FROM brands WHERE brand_code = 'intel'), 
 (SELECT category_id FROM categories WHERE category_code = 'intel-cpu'), 
 9990000, 25, TRUE),

('Intel Core i5-13600K', 'intel-i5-13600k', 
 (SELECT brand_id FROM brands WHERE brand_code = 'intel'), 
 (SELECT category_id FROM categories WHERE category_code = 'intel-cpu'), 
 6990000, 30, TRUE);

-- Thêm sản phẩm CPU AMD
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 
 (SELECT brand_id FROM brands WHERE brand_code = 'amd'), 
 (SELECT category_id FROM categories WHERE category_code = 'amd-cpu'), 
 15990000, 12, TRUE),

('AMD Ryzen 7 7700X', 'amd-ryzen-7-7700x', 
 (SELECT brand_id FROM brands WHERE brand_code = 'amd'), 
 (SELECT category_id FROM categories WHERE category_code = 'amd-cpu'), 
 8990000, 20, TRUE),

('AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x', 
 (SELECT brand_id FROM brands WHERE brand_code = 'amd'), 
 (SELECT category_id FROM categories WHERE category_code = 'amd-cpu'), 
 5990000, 35, TRUE);

-- Thêm sản phẩm VGA NVIDIA
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('NVIDIA GeForce RTX 4090', 'nvidia-rtx-4090', 
 (SELECT brand_id FROM brands WHERE brand_code = 'nvidia'), 
 (SELECT category_id FROM categories WHERE category_code = 'nvidia-vga'), 
 45990000, 8, TRUE),

('NVIDIA GeForce RTX 4080', 'nvidia-rtx-4080', 
 (SELECT brand_id FROM brands WHERE brand_code = 'nvidia'), 
 (SELECT category_id FROM categories WHERE category_code = 'nvidia-vga'), 
 32990000, 15, TRUE),

('NVIDIA GeForce RTX 4070', 'nvidia-rtx-4070', 
 (SELECT brand_id FROM brands WHERE brand_code = 'nvidia'), 
 (SELECT category_id FROM categories WHERE category_code = 'nvidia-vga'), 
 18990000, 25, TRUE);

-- Thêm sản phẩm VGA AMD
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('AMD Radeon RX 7900 XTX', 'amd-rx-7900-xtx', 
 (SELECT brand_id FROM brands WHERE brand_code = 'amd'), 
 (SELECT category_id FROM categories WHERE category_code = 'amd-vga'), 
 28990000, 10, TRUE),

('AMD Radeon RX 7800 XT', 'amd-rx-7800-xt', 
 (SELECT brand_id FROM brands WHERE brand_code = 'amd'), 
 (SELECT category_id FROM categories WHERE category_code = 'amd-vga'), 
 16990000, 18, TRUE);

-- Thêm sản phẩm RAM DDR5
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('Corsair Dominator Platinum RGB 32GB DDR5-5600', 'corsair-dom-32gb-ddr5-5600', 
 (SELECT brand_id FROM brands WHERE brand_code = 'corsair'), 
 (SELECT category_id FROM categories WHERE category_code = 'ddr5'), 
 7990000, 20, TRUE),

('G.Skill Trident Z5 RGB 16GB DDR5-6000', 'gskill-tz5-16gb-ddr5-6000', 
 (SELECT brand_id FROM brands WHERE brand_code = 'gskill'), 
 (SELECT category_id FROM categories WHERE category_code = 'ddr5'), 
 4990000, 35, TRUE);

-- Thêm sản phẩm RAM DDR4
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('Corsair Vengeance LPX 32GB DDR4-3200', 'corsair-lpx-32gb-ddr4-3200', 
 (SELECT brand_id FROM brands WHERE brand_code = 'corsair'), 
 (SELECT category_id FROM categories WHERE category_code = 'ddr4'), 
 3990000, 40, TRUE),

('G.Skill Ripjaws V 16GB DDR4-3600', 'gskill-rjv-16gb-ddr4-3600', 
 (SELECT brand_id FROM brands WHERE brand_code = 'gskill'), 
 (SELECT category_id FROM categories WHERE category_code = 'ddr4'), 
 1990000, 50, TRUE);

-- Thêm sản phẩm SSD
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('Samsung 980 PRO 2TB NVMe SSD', 'samsung-980pro-2tb', 
 (SELECT brand_id FROM brands WHERE brand_code = 'samsung'), 
 (SELECT category_id FROM categories WHERE category_code = 'ssd'), 
 4990000, 25, TRUE),

('WD Black SN850X 1TB NVMe SSD', 'wd-sn850x-1tb', 
 (SELECT brand_id FROM brands WHERE brand_code = 'wd'), 
 (SELECT category_id FROM categories WHERE category_code = 'ssd'), 
 2990000, 30, TRUE),

('Kingston NV2 500GB NVMe SSD', 'kingston-nv2-500gb', 
 (SELECT brand_id FROM brands WHERE brand_code = 'kingston'), 
 (SELECT category_id FROM categories WHERE category_code = 'ssd'), 
 1290000, 45, TRUE);

-- Thêm sản phẩm HDD
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('Seagate Barracuda 4TB 7200RPM', 'seagate-barracuda-4tb', 
 (SELECT brand_id FROM brands WHERE brand_code = 'seagate'), 
 (SELECT category_id FROM categories WHERE category_code = 'hdd'), 
 2490000, 20, TRUE),

('WD Blue 2TB 7200RPM', 'wd-blue-2tb', 
 (SELECT brand_id FROM brands WHERE brand_code = 'wd'), 
 (SELECT category_id FROM categories WHERE category_code = 'hdd'), 
 1590000, 35, TRUE);

-- Thêm sản phẩm Mainboard
INSERT INTO products (product_name, product_code, brand_id, category_id, price, stock_quantity, is_active) VALUES
('ASUS ROG Maximus Z790 Hero', 'asus-rog-z790-hero', 
 (SELECT brand_id FROM brands WHERE brand_code = 'asus'), 
 (SELECT category_id FROM categories WHERE category_code = 'mainboard'), 
 12990000, 10, TRUE),

('MSI MAG Z790 Tomahawk WiFi', 'msi-z790-tomahawk', 
 (SELECT brand_id FROM brands WHERE brand_code = 'msi'), 
 (SELECT category_id FROM categories WHERE category_code = 'mainboard'), 
 6990000, 15, TRUE),

('Gigabyte B650 AORUS Elite AX', 'gigabyte-b650-aorus', 
 (SELECT brand_id FROM brands WHERE brand_code = 'gigabyte'), 
 (SELECT category_id FROM categories WHERE category_code = 'mainboard'), 
 4990000, 18, TRUE);

-- Kiểm tra kết quả
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_products,
    MIN(price) as min_price,
    MAX(price) as max_price,
    SUM(stock_quantity) as total_stock
FROM products;

-- Hiển thị sản phẩm theo danh mục
SELECT 
    c.category_name,
    COUNT(p.product_id) as product_count,
    AVG(p.price) as avg_price
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_id, c.category_name
ORDER BY product_count DESC; 