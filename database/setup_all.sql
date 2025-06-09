-- =====================================
-- SETUP COMPLETE DATABASE FOR GEAR SHOP
-- =====================================

-- Sử dụng database gear_shop
USE gear_shop;

-- Hiển thị thông tin bắt đầu setup
SELECT 'Bắt đầu setup database Gear Shop...' as message;

-- =====================================
-- 1. TẠO BẢNG CATEGORIES
-- =====================================

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

SELECT 'Bảng categories đã được tạo' as message;

-- =====================================
-- 2. TẠO BẢNG PRODUCTS
-- =====================================

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

SELECT 'Bảng products đã được tạo' as message;

-- =====================================
-- 3. KIỂM TRA VÀ THÊM DỮ LIỆU MẪU CHO CATEGORIES
-- =====================================

-- Kiểm tra xem đã có dữ liệu chưa
SET @category_count = (SELECT COUNT(*) FROM categories);

-- Chỉ thêm dữ liệu nếu bảng trống
SELECT 
    @category_count as existing_categories,
    CASE 
        WHEN @category_count = 0 THEN 'Sẽ thêm dữ liệu mẫu'
        ELSE 'Bảng đã có dữ liệu, bỏ qua việc thêm mẫu'
    END as action;

-- Thêm dữ liệu mẫu nếu bảng trống
INSERT INTO categories (category_name, category_code, description, icon_code, parent_id, is_active)
SELECT * FROM (
    SELECT 'CPU - Bộ Vi Xử Lý' as category_name, 'cpu' as category_code, 'Central Processing Unit - Bộ xử lý trung tâm máy tính' as description, '🔧' as icon_code, NULL as parent_id, TRUE as is_active
    UNION ALL SELECT 'VGA - Card Đồ Họa', 'vga', 'Graphics Processing Unit - Card đồ họa xử lý hình ảnh', '🎮', NULL, TRUE
    UNION ALL SELECT 'Mainboard - Bo Mạch Chủ', 'mainboard', 'Motherboard - Bo mạch chủ kết nối các linh kiện', '🔌', NULL, TRUE
    UNION ALL SELECT 'RAM - Bộ Nhớ', 'ram', 'Random Access Memory - Bộ nhớ truy cập ngẫu nhiên', '💾', NULL, TRUE
    UNION ALL SELECT 'Storage - Lưu Trữ', 'storage', 'Ổ cứng HDD, SSD và các thiết bị lưu trữ dữ liệu', '💿', NULL, TRUE
    UNION ALL SELECT 'PSU - Nguồn Máy Tính', 'psu', 'Power Supply Unit - Bộ nguồn cấp điện cho máy tính', '⚡', NULL, TRUE
    UNION ALL SELECT 'Cooling - Tản Nhiệt', 'cooling', 'Hệ thống làm mát CPU, VGA và case', '❄️', NULL, TRUE
    UNION ALL SELECT 'Case - Vỏ Máy Tính', 'case', 'Computer Case - Vỏ máy tính và phụ kiện', '🏠', NULL, TRUE
    UNION ALL SELECT 'Monitor - Màn Hình', 'monitor', 'Computer Monitor - Màn hình máy tính các loại', '🖥️', NULL, TRUE
    UNION ALL SELECT 'Networking - Thiết Bị Mạng', 'networking', 'Router, Switch, WiFi và thiết bị mạng', '🌐', NULL, TRUE
    UNION ALL SELECT 'Peripherals - Phụ Kiện', 'peripherals', 'Bàn phím, chuột, tai nghe và phụ kiện máy tính', '⌨️', NULL, TRUE
    UNION ALL SELECT 'Gaming - Gaming Gear', 'gaming', 'Gear và phụ kiện gaming chuyên nghiệp', '🎯', NULL, TRUE
) as new_categories
WHERE @category_count = 0;

-- Thêm sub-categories nếu bảng trống
INSERT INTO categories (category_name, category_code, description, icon_code, parent_id, is_active)
SELECT * FROM (
    SELECT 'Intel CPU' as category_name, 'intel-cpu' as category_code, 'Bộ vi xử lý Intel các dòng' as description, 'fa-microchip' as icon_code, (SELECT category_id FROM categories WHERE category_code = 'cpu') as parent_id, TRUE as is_active
    UNION ALL SELECT 'AMD CPU', 'amd-cpu', 'Bộ vi xử lý AMD Ryzen và FX', 'fa-microchip', (SELECT category_id FROM categories WHERE category_code = 'cpu'), TRUE
    UNION ALL SELECT 'NVIDIA GeForce', 'nvidia-geforce', 'Card đồ họa NVIDIA GeForce RTX, GTX', 'fa-display', (SELECT category_id FROM categories WHERE category_code = 'vga'), TRUE
    UNION ALL SELECT 'AMD Radeon', 'amd-radeon', 'Card đồ họa AMD Radeon RX', 'fa-display', (SELECT category_id FROM categories WHERE category_code = 'vga'), TRUE
    UNION ALL SELECT 'SSD SATA', 'ssd-sata', 'Solid State Drive SATA 2.5 inch', 'fa-hdd', (SELECT category_id FROM categories WHERE category_code = 'storage'), TRUE
    UNION ALL SELECT 'SSD NVMe', 'ssd-nvme', 'NVMe SSD M.2 tốc độ cao', 'fa-bolt', (SELECT category_id FROM categories WHERE category_code = 'storage'), TRUE
    UNION ALL SELECT 'HDD', 'hdd', 'Hard Disk Drive - Ổ cứng cơ học', 'fa-circle-dot', (SELECT category_id FROM categories WHERE category_code = 'storage'), TRUE
    UNION ALL SELECT 'DDR4 RAM', 'ddr4-ram', 'Bộ nhớ DDR4 desktop và laptop', 'fa-memory', (SELECT category_id FROM categories WHERE category_code = 'ram'), TRUE
    UNION ALL SELECT 'DDR5 RAM', 'ddr5-ram', 'Bộ nhớ DDR5 thế hệ mới', 'fa-memory', (SELECT category_id FROM categories WHERE category_code = 'ram'), TRUE
    UNION ALL SELECT 'Gaming Keyboard', 'gaming-keyboard', 'Bàn phím gaming cơ và màng', '⌨️', (SELECT category_id FROM categories WHERE category_code = 'peripherals'), TRUE
    UNION ALL SELECT 'Gaming Mouse', 'gaming-mouse', 'Chuột gaming có dây và không dây', '🖱️', (SELECT category_id FROM categories WHERE category_code = 'peripherals'), TRUE
    UNION ALL SELECT 'Gaming Headset', 'gaming-headset', 'Tai nghe gaming và streamer', '🎧', (SELECT category_id FROM categories WHERE category_code = 'peripherals'), TRUE
) as new_subcategories
WHERE @category_count = 0;

SELECT 'Dữ liệu mẫu đã được thêm (nếu cần)' as message;

-- =====================================
-- 4. HIỂN THỊ KẾT QUẢ
-- =====================================

-- Hiển thị tổng số categories
SELECT COUNT(*) as total_categories FROM categories;

-- Hiển thị categories theo level
SELECT 
    CASE 
        WHEN parent_id IS NULL THEN 'Level 1 (Main)'
        WHEN category_id IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL) THEN 'Level 2 (Sub)'
        ELSE 'Level 3 (Sub-Sub)'
    END as category_level,
    COUNT(*) as count
FROM categories 
GROUP BY 
    CASE 
        WHEN parent_id IS NULL THEN 'Level 1 (Main)'
        WHEN category_id IN (SELECT DISTINCT parent_id FROM categories WHERE parent_id IS NOT NULL) THEN 'Level 2 (Sub)'
        ELSE 'Level 3 (Sub-Sub)'
    END;

-- Hiển thị một số categories mẫu
SELECT 
    c1.category_name as main_category,
    c2.category_name as sub_category
FROM categories c1
LEFT JOIN categories c2 ON c1.category_id = c2.parent_id
WHERE c1.parent_id IS NULL
ORDER BY c1.category_name, c2.category_name
LIMIT 20;

SELECT 'Setup database hoàn tất!' as message; 