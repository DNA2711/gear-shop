-- =====================================
-- BẢNG CATEGORIES ĐƠN GIẢN HÓA
-- =====================================

USE gear_shop;

-- Xóa bảng cũ nếu có (cẩn thận!)
-- DROP TABLE IF EXISTS products;  -- Uncomment nếu cần
-- DROP TABLE IF EXISTS categories; -- Uncomment nếu cần

-- Tạo bảng categories đơn giản
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    parent_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_category_code (category_code),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active)
);

-- Xóa dữ liệu cũ nếu có
TRUNCATE TABLE categories;

-- Thêm dữ liệu đơn giản
INSERT INTO categories (category_name, category_code, parent_id, is_active) VALUES

-- Level 1 - Categories chính
('CPU', 'cpu', NULL, TRUE),
('VGA', 'vga', NULL, TRUE),
('Mainboard', 'mainboard', NULL, TRUE),
('RAM', 'ram', NULL, TRUE),
('Storage', 'storage', NULL, TRUE),
('Cooling', 'cooling', NULL, TRUE),
('Case', 'case', NULL, TRUE),
('Monitor', 'monitor', NULL, TRUE),
('Accessories', 'accessories', NULL, TRUE);

-- Level 2 - Sub-categories
INSERT INTO categories (category_name, category_code, parent_id, is_active) VALUES
('Intel', 'intel-cpu', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'cpu'), TRUE),
('AMD', 'amd-cpu', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'cpu'), TRUE),
('NVIDIA', 'nvidia-vga', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'vga'), TRUE),
('AMD Radeon', 'amd-vga', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'vga'), TRUE),
('SSD', 'ssd', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'storage'), TRUE),
('HDD', 'hdd', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'storage'), TRUE),
('DDR4', 'ddr4', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'ram'), TRUE),
('DDR5', 'ddr5', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'ram'), TRUE),
('Gaming Monitor', 'gaming-monitor', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'monitor'), TRUE),
('Office Monitor', 'office-monitor', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'monitor'), TRUE),
('Keyboard', 'keyboard', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'accessories'), TRUE),
('Mouse', 'mouse', (SELECT category_id FROM (SELECT * FROM categories) AS c WHERE category_code = 'accessories'), TRUE);

-- Tạo bảng products đơn giản
CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    brand_id INT,
    category_id BIGINT,
    price DECIMAL(15, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_product_code (product_code),
    INDEX idx_brand_id (brand_id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active)
);

-- Kiểm tra kết quả
SELECT 
    COUNT(*) as total_categories,
    COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as main_categories,
    COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as sub_categories
FROM categories;

-- Hiển thị hierarchy
SELECT 
    c1.category_name as main_category,
    c2.category_name as sub_category
FROM categories c1
LEFT JOIN categories c2 ON c1.category_id = c2.parent_id
WHERE c1.parent_id IS NULL
ORDER BY c1.category_name, c2.category_name; 