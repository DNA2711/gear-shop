-- =====================================
-- DEBUG REGISTER ERROR
-- =====================================

USE railway;

-- Kiểm tra cấu trúc bảng users
DESCRIBE users;

-- Kiểm tra tất cả user hiện có
SELECT * FROM users LIMIT 5;

-- Test insert user mới để xem lỗi gì
INSERT IGNORE INTO users (full_name, email, password_hash, phone_number, address, role, created_at) 
VALUES ('Test Register', 'test-register@gearshop.com', '$2a$10$testHashForDebug', '0123456789', 'Test Address', 'USER', NOW());

-- Kiểm tra user vừa tạo
SELECT * FROM users WHERE email = 'test-register@gearshop.com';

-- Kiểm tra charset của bảng users
SELECT 
    TABLE_NAME,
    TABLE_COLLATION,
    ENGINE
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'railway' AND TABLE_NAME = 'users';

-- Kiểm tra charset của các cột trong users
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_SET_NAME,
    COLLATION_NAME,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'railway' AND TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;

SELECT 'Debug completed - check results above!' as message; 