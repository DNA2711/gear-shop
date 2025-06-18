-- Script cập nhật và làm sạch mô tả sản phẩm
-- Loại bỏ ký tự đặc biệt, HTML tags, và đảm bảo mô tả an toàn

-- 1. Thêm cột description nếu chưa có
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Cập nhật mô tả mặc định cho các sản phẩm chưa có mô tả
UPDATE products 
SET description = CASE 
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'cpu') 
    THEN CONCAT('Bộ vi xử lý ', product_name, ' - Hiệu năng mạnh mẽ, phù hợp cho gaming và công việc chuyên nghiệp.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'vga') 
    THEN CONCAT('Card đồ họa ', product_name, ' - Trải nghiệm gaming tuyệt vời với chất lượng hình ảnh cao.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'mainboard') 
    THEN CONCAT('Bo mạch chủ ', product_name, ' - Kết nối ổn định, hỗ trợ nhiều tính năng hiện đại.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'ram') 
    THEN CONCAT('Bộ nhớ RAM ', product_name, ' - Tăng tốc độ xử lý, đa nhiệm mượt mà.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'storage') 
    THEN CONCAT('Ổ cứng ', product_name, ' - Lưu trữ dữ liệu an toàn, tốc độ truy xuất nhanh.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'psu') 
    THEN CONCAT('Nguồn máy tính ', product_name, ' - Cung cấp điện ổn định, hiệu suất cao.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'case') 
    THEN CONCAT('Vỏ máy tính ', product_name, ' - Thiết kế đẹp mắt, tản nhiệt tốt.')
    
    WHEN category_id IN (SELECT category_id FROM categories WHERE category_code = 'cooling') 
    THEN CONCAT('Tản nhiệt ', product_name, ' - Giữ nhiệt độ máy ổn định, hoạt động êm ái.')
    
    ELSE CONCAT('Sản phẩm ', product_name, ' - Chất lượng cao, giá cả hợp lý.')
END
WHERE description IS NULL OR description = '' OR description = 'NULL';

-- 3. Làm sạch mô tả hiện tại
-- Loại bỏ HTML tags
UPDATE products SET description = REGEXP_REPLACE(description, '<[^>]*>', '');

-- Loại bỏ ký tự đặc biệt có thể gây lỗi
UPDATE products SET description = REPLACE(description, '\r\n', ' ');
UPDATE products SET description = REPLACE(description, '\n', ' ');
UPDATE products SET description = REPLACE(description, '\r', ' ');
UPDATE products SET description = REPLACE(description, '\t', ' ');

-- Loại bỏ khoảng trắng thừa
UPDATE products SET description = TRIM(REGEXP_REPLACE(description, ' +', ' '));

-- 4. Giới hạn độ dài mô tả (tối đa 500 ký tự)
UPDATE products 
SET description = CASE 
    WHEN CHAR_LENGTH(description) > 500 
    THEN CONCAT(LEFT(description, 497), '...')
    ELSE description
END;

-- 5. Cập nhật thời gian sửa đổi
UPDATE products SET updated_at = NOW() WHERE description IS NOT NULL;

-- 6. Kiểm tra kết quả
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    CHAR_LENGTH(p.description) as description_length,
    LEFT(p.description, 100) as description_preview
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
ORDER BY p.category_id, p.product_name
LIMIT 20;

-- 7. Thống kê sau khi cập nhật
SELECT 
    c.category_name,
    COUNT(*) as total_products,
    COUNT(CASE WHEN p.description IS NOT NULL AND p.description != '' THEN 1 END) as products_with_description,
    AVG(CHAR_LENGTH(p.description)) as avg_description_length
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_name; 