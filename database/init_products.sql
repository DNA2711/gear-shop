-- =====================================
-- KHỞI TẠO BẢNG PRODUCTS (AN TOÀN)
-- =====================================

USE gear_shop;

-- Tạo bảng products nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    brand_id BIGINT,
    category_id BIGINT,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    sale_price DECIMAL(15, 2) NULL,
    stock_quantity INT DEFAULT 0,
    image_urls JSON,
    specifications JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_product_code (product_code),
    INDEX idx_brand_id (brand_id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_price (price)
);

-- Kiểm tra xem có dữ liệu không
SELECT 
    COUNT(*) as existing_products,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Bảng trống'
        ELSE 'Bảng đã có dữ liệu'
    END as status
FROM products;

-- Nếu muốn xem cấu trúc bảng
DESCRIBE products; 