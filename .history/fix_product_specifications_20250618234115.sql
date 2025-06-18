-- Script làm sạch thông số sản phẩm (product_specifications)
-- Loại bỏ ký tự ???, ký tự đặc biệt và cập nhật thông số chất lượng

-- 1. Kiểm tra các thông số có ký tự ??? hiện tại
SELECT 
    COUNT(*) as total_specs,
    COUNT(CASE WHEN spec_name LIKE '%???%' OR spec_value LIKE '%???%' THEN 1 END) as specs_with_question_marks,
    COUNT(CASE WHEN spec_name = '' OR spec_value = '' OR spec_name IS NULL OR spec_value IS NULL THEN 1 END) as empty_specs
FROM product_specifications;

-- 2. Hiển thị một số ví dụ thông số có vấn đề
SELECT product_id, spec_name, spec_value 
FROM product_specifications 
WHERE spec_name LIKE '%???%' OR spec_value LIKE '%???%' OR spec_name = '' OR spec_value = ''
LIMIT 10;

-- 3. Loại bỏ thông số có ký tự ??? hoặc rỗng
DELETE FROM product_specifications 
WHERE spec_name LIKE '%???%' 
   OR spec_value LIKE '%???%' 
   OR spec_name = '' 
   OR spec_value = '' 
   OR spec_name IS NULL 
   OR spec_value IS NULL;

-- 4. Làm sạch các thông số còn lại
-- Loại bỏ ký tự đặc biệt và khoảng trắng thừa
UPDATE product_specifications 
SET spec_name = TRIM(REGEXP_REPLACE(spec_name, '[^\p{L}\p{N}\p{P}\p{S}\p{Z}]', ''));

UPDATE product_specifications 
SET spec_value = TRIM(REGEXP_REPLACE(spec_value, '[^\p{L}\p{N}\p{P}\p{S}\p{Z}]', ''));

-- Loại bỏ khoảng trắng thừa
UPDATE product_specifications 
SET spec_name = TRIM(REGEXP_REPLACE(spec_name, ' +', ' '));

UPDATE product_specifications 
SET spec_value = TRIM(REGEXP_REPLACE(spec_value, ' +', ' '));

-- 5. Cập nhật thông số chuẩn cho các loại sản phẩm
-- CPU specifications
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%socket%' OR ps.spec_name LIKE '%Socket%' THEN 'Socket'
    WHEN ps.spec_name LIKE '%core%' OR ps.spec_name LIKE '%Core%' THEN 'Số nhân'
    WHEN ps.spec_name LIKE '%thread%' OR ps.spec_name LIKE '%Thread%' THEN 'Số luồng'
    WHEN ps.spec_name LIKE '%frequency%' OR ps.spec_name LIKE '%clock%' OR ps.spec_name LIKE '%MHz%' OR ps.spec_name LIKE '%GHz%' THEN 'Tần số'
    WHEN ps.spec_name LIKE '%cache%' OR ps.spec_name LIKE '%Cache%' THEN 'Bộ nhớ cache'
    WHEN ps.spec_name LIKE '%TDP%' OR ps.spec_name LIKE '%tdp%' THEN 'TDP'
    ELSE ps.spec_name
END
WHERE c.category_code = 'cpu';

-- VGA specifications  
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%memory%' OR ps.spec_name LIKE '%Memory%' OR ps.spec_name LIKE '%VRAM%' THEN 'Bộ nhớ'
    WHEN ps.spec_name LIKE '%interface%' OR ps.spec_name LIKE '%Interface%' THEN 'Giao diện'
    WHEN ps.spec_name LIKE '%power%' OR ps.spec_name LIKE '%Power%' OR ps.spec_name LIKE '%watts%' THEN 'Công suất'
    WHEN ps.spec_name LIKE '%cuda%' OR ps.spec_name LIKE '%CUDA%' THEN 'CUDA Cores'
    WHEN ps.spec_name LIKE '%stream%' OR ps.spec_name LIKE '%Stream%' THEN 'Stream Processors'
    ELSE ps.spec_name
END
WHERE c.category_code = 'vga';

-- RAM specifications
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%capacity%' OR ps.spec_name LIKE '%size%' OR ps.spec_name LIKE '%GB%' THEN 'Dung lượng'
    WHEN ps.spec_name LIKE '%speed%' OR ps.spec_name LIKE '%frequency%' THEN 'Tốc độ'
    WHEN ps.spec_name LIKE '%type%' OR ps.spec_name LIKE '%DDR%' THEN 'Loại'
    WHEN ps.spec_name LIKE '%latency%' OR ps.spec_name LIKE '%timing%' THEN 'Độ trễ'
    ELSE ps.spec_name
END
WHERE c.category_code = 'ram';

-- Mainboard specifications
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%socket%' OR ps.spec_name LIKE '%Socket%' THEN 'Socket CPU'
    WHEN ps.spec_name LIKE '%chipset%' OR ps.spec_name LIKE '%Chipset%' THEN 'Chipset'
    WHEN ps.spec_name LIKE '%form%' OR ps.spec_name LIKE '%Form%' OR ps.spec_name LIKE '%size%' THEN 'Form Factor'
    WHEN ps.spec_name LIKE '%memory%' OR ps.spec_name LIKE '%Memory%' OR ps.spec_name LIKE '%RAM%' THEN 'Hỗ trợ RAM'
    WHEN ps.spec_name LIKE '%slot%' OR ps.spec_name LIKE '%Slot%' THEN 'Số slot'
    ELSE ps.spec_name
END
WHERE c.category_code = 'mainboard';

-- Storage specifications
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%capacity%' OR ps.spec_name LIKE '%size%' OR ps.spec_name LIKE '%TB%' OR ps.spec_name LIKE '%GB%' THEN 'Dung lượng'
    WHEN ps.spec_name LIKE '%interface%' OR ps.spec_name LIKE '%connector%' THEN 'Giao diện'
    WHEN ps.spec_name LIKE '%speed%' OR ps.spec_name LIKE '%rpm%' THEN 'Tốc độ'
    WHEN ps.spec_name LIKE '%type%' OR ps.spec_name LIKE '%SSD%' OR ps.spec_name LIKE '%HDD%' THEN 'Loại'
    ELSE ps.spec_name
END
WHERE c.category_code = 'storage';

-- PSU specifications
UPDATE product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
SET ps.spec_name = CASE 
    WHEN ps.spec_name LIKE '%watt%' OR ps.spec_name LIKE '%power%' OR ps.spec_name LIKE '%W%' THEN 'Công suất'
    WHEN ps.spec_name LIKE '%efficiency%' OR ps.spec_name LIKE '%80%' THEN 'Hiệu suất'
    WHEN ps.spec_name LIKE '%modular%' OR ps.spec_name LIKE '%cable%' THEN 'Loại cáp'
    WHEN ps.spec_name LIKE '%form%' OR ps.spec_name LIKE '%ATX%' THEN 'Form Factor'
    ELSE ps.spec_name
END
WHERE c.category_code = 'psu';

-- 6. Cập nhật thời gian sửa đổi
UPDATE product_specifications SET updated_at = NOW();

-- 7. Thống kê sau khi làm sạch
SELECT 
    c.category_name,
    COUNT(ps.spec_id) as total_specifications,
    COUNT(DISTINCT ps.spec_name) as unique_spec_names,
    COUNT(DISTINCT ps.product_id) as products_with_specs
FROM product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY c.category_id, c.category_name
ORDER BY c.category_name;

-- 8. Hiển thị một số thông số sau khi cập nhật
SELECT 
    p.product_name,
    c.category_name,
    ps.spec_name,
    ps.spec_value
FROM product_specifications ps
JOIN products p ON ps.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
ORDER BY c.category_name, p.product_name, ps.display_order
LIMIT 20; 