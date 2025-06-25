-- =====================================
-- FIX CHARSET TIẾNG VIỆT CHO RAILWAY DB
-- =====================================

-- Set charset cho session hiện tại
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

-- Sử dụng database railway
USE railway;

-- Kiểm tra charset hiện tại của database
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'railway';

-- Thay đổi charset của database nếu cần
ALTER DATABASE railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix charset cho bảng categories
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix charset cho các cột cụ thể trong categories
ALTER TABLE categories 
MODIFY COLUMN category_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
MODIFY COLUMN category_code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- Fix charset cho bảng users (nếu có)
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users 
MODIFY COLUMN email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
MODIFY COLUMN full_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
MODIFY COLUMN address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix charset cho bảng brands (nếu có)
ALTER TABLE brands CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix charset cho bảng products (nếu có)
ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Xóa dữ liệu categories cũ (bị lỗi charset)
DELETE FROM categories;

-- Reset AUTO_INCREMENT
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Thêm lại dữ liệu categories với charset đúng
INSERT INTO categories (category_name, category_code, parent_id, is_active) VALUES
('CPU - Bộ Vi Xử Lý', 'cpu', NULL, TRUE),
('VGA - Card Đồ Họa', 'vga', NULL, TRUE),
('Mainboard - Bo Mạch Chủ', 'mainboard', NULL, TRUE),
('RAM - Bộ Nhớ', 'ram', NULL, TRUE),
('Storage - Lưu Trữ', 'storage', NULL, TRUE),
('PSU - Nguồn Máy Tính', 'psu', NULL, TRUE),
('Cooling - Tản Nhiệt', 'cooling', NULL, TRUE),
('Case - Vỏ Máy Tính', 'case', NULL, TRUE),
('Monitor - Màn Hình', 'monitor', NULL, TRUE),
('Networking - Thiết Bị Mạng', 'networking', NULL, TRUE),
('Peripherals - Phụ Kiện', 'peripherals', NULL, TRUE),
('Gaming - Gaming Gear', 'gaming', NULL, TRUE);

-- Thêm sub-categories
INSERT INTO categories (category_name, category_code, parent_id, is_active) VALUES
-- CPU subcategories
('Intel CPU', 'intel-cpu', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'cpu'), TRUE),
('AMD CPU', 'amd-cpu', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'cpu'), TRUE),

-- VGA subcategories  
('NVIDIA GeForce', 'nvidia-geforce', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'vga'), TRUE),
('AMD Radeon', 'amd-radeon', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'vga'), TRUE),

-- Mainboard subcategories
('Intel Mainboard', 'intel-mainboard', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'mainboard'), TRUE),
('AMD Mainboard', 'amd-mainboard', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'mainboard'), TRUE),

-- RAM subcategories
('DDR4 RAM', 'ddr4-ram', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'ram'), TRUE),
('DDR5 RAM', 'ddr5-ram', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'ram'), TRUE),

-- Storage subcategories
('SSD SATA', 'ssd-sata', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'storage'), TRUE),
('SSD NVMe', 'ssd-nvme', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'storage'), TRUE),
('HDD', 'hdd', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'storage'), TRUE),

-- PSU subcategories
('PSU 80+ Bronze', 'psu-bronze', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'psu'), TRUE),
('PSU 80+ Gold', 'psu-gold', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'psu'), TRUE),
('PSU Modular', 'psu-modular', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'psu'), TRUE),

-- Cooling subcategories
('Air Cooler', 'air-cooler', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'cooling'), TRUE),
('AIO Liquid Cooler', 'aio-cooler', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'cooling'), TRUE),
('Case Fan', 'case-fan', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'cooling'), TRUE),

-- Case subcategories
('ATX Case', 'atx-case', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'case'), TRUE),
('mATX Case', 'matx-case', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'case'), TRUE),
('ITX Case', 'itx-case', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'case'), TRUE),

-- Monitor subcategories
('Gaming Monitor', 'gaming-monitor', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'monitor'), TRUE),
('Office Monitor', 'office-monitor', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'monitor'), TRUE),
('4K Monitor', '4k-monitor', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'monitor'), TRUE),

-- Networking subcategories
('Router WiFi', 'router-wifi', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'networking'), TRUE),
('Network Switch', 'network-switch', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'networking'), TRUE),
('USB WiFi', 'usb-wifi', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'networking'), TRUE),

-- Peripherals subcategories
('Gaming Keyboard', 'gaming-keyboard', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'peripherals'), TRUE),
('Gaming Mouse', 'gaming-mouse', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'peripherals'), TRUE),
('Gaming Headset', 'gaming-headset', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'peripherals'), TRUE),
('Webcam', 'webcam', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'peripherals'), TRUE),

-- Gaming subcategories
('Gaming Chair', 'gaming-chair', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'gaming'), TRUE),
('Gaming Desk', 'gaming-desk', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'gaming'), TRUE),
('RGB Lighting', 'rgb-lighting', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE c.category_code = 'gaming'), TRUE);

-- Kiểm tra kết quả
SELECT 'Hoàn tất fix charset và thêm dữ liệu tiếng Việt!' as message;

-- Hiển thị một số categories để kiểm tra tiếng Việt
SELECT category_id, category_name, category_code 
FROM categories 
WHERE parent_id IS NULL 
ORDER BY category_name
LIMIT 10;

-- Hiển thị thống kê
SELECT 
    COUNT(*) as total_categories,
    COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as main_categories,
    COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as sub_categories
FROM categories;

SELECT 'Database đã được fix charset UTF-8 thành công!' as final_message; 