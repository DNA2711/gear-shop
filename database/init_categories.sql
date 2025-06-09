-- =====================================
-- KHỞI TẠO BẢNG CATEGORIES (AN TOÀN)
-- =====================================

USE gear_shop;

-- Tạo bảng categories nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_code VARCHAR(100),
    parent_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_category_code (category_code),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active)
);

-- Kiểm tra xem có dữ liệu không
SELECT 
    COUNT(*) as existing_categories,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Bảng trống - có thể thêm dữ liệu mẫu'
        ELSE 'Bảng đã có dữ liệu'
    END as status
FROM categories;

-- Nếu muốn xem cấu trúc bảng
DESCRIBE categories; 