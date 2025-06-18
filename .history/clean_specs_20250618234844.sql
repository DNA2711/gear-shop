-- Xóa thông số có ký tự ??? và làm sạch dữ liệu
DELETE FROM product_specifications 
WHERE spec_name LIKE '%???%' 
   OR spec_value LIKE '%???%' 
   OR spec_name = '' 
   OR spec_value = '';

-- Làm sạch khoảng trắng thừa
UPDATE product_specifications 
SET spec_name = TRIM(spec_name),
    spec_value = TRIM(spec_value);

-- Cập nhật thời gian
UPDATE product_specifications SET updated_at = NOW();

-- Hiển thị kết quả
SELECT COUNT(*) as remaining_specs FROM product_specifications; 