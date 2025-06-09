-- Tạo bảng product_images để lưu trữ ảnh sản phẩm
CREATE TABLE IF NOT EXISTS product_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    image_code TEXT NOT NULL COMMENT 'Base64 encoded image data',
    is_primary BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu ảnh chính (đại diện)',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_display_order (display_order)
);

-- Đảm bảo mỗi sản phẩm chỉ có 1 ảnh chính
ALTER TABLE product_images ADD CONSTRAINT unique_primary_per_product 
UNIQUE KEY (product_id, is_primary); 