-- Tạo bảng categories đơn giản
USE gear_shop;

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    parent_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm indexes
CREATE INDEX IF NOT EXISTS idx_category_code ON categories(category_code);
CREATE INDEX IF NOT EXISTS idx_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_is_active ON categories(is_active);

-- Thêm dữ liệu mẫu
INSERT IGNORE INTO categories (category_name, category_code, parent_id, is_active) VALUES
('CPU', 'cpu', NULL, TRUE),
('VGA', 'vga', NULL, TRUE),
('Mainboard', 'mainboard', NULL, TRUE),
('RAM', 'ram', NULL, TRUE),
('Storage', 'storage', NULL, TRUE),
('Cooling', 'cooling', NULL, TRUE),
('Case', 'case', NULL, TRUE),
('Monitor', 'monitor', NULL, TRUE),
('Accessories', 'accessories', NULL, TRUE);

-- Thêm sub-categories
INSERT IGNORE INTO categories (category_name, category_code, parent_id, is_active) VALUES
('Intel', 'intel-cpu', 1, TRUE),
('AMD', 'amd-cpu', 1, TRUE),
('NVIDIA', 'nvidia-vga', 2, TRUE),
('AMD Radeon', 'amd-vga', 2, TRUE),
('SSD', 'ssd', 5, TRUE),
('HDD', 'hdd', 5, TRUE),
('DDR4', 'ddr4', 4, TRUE),
('DDR5', 'ddr5', 4, TRUE),
('Gaming Monitor', 'gaming-monitor', 8, TRUE),
('Office Monitor', 'office-monitor', 8, TRUE),
('Keyboard', 'keyboard', 9, TRUE),
('Mouse', 'mouse', 9, TRUE);

-- Hiển thị kết quả
SELECT 'Tạo bảng categories thành công!' as message;
SELECT COUNT(*) as total_categories FROM categories;
SELECT * FROM categories ORDER BY parent_id, category_name; 