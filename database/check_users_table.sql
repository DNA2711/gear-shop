-- =====================================
-- KIỂM TRA VÀ SETUP BẢNG USERS
-- =====================================

USE gear_shop;

-- Kiểm tra xem bảng users có tồn tại không
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Bảng users đã tồn tại'
        ELSE 'Bảng users chưa tồn tại'
    END as table_status
FROM information_schema.tables 
WHERE table_schema = 'gear_shop' AND table_name = 'users';

-- Tạo bảng users nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    role VARCHAR(50) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    avatar_code TEXT,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Kiểm tra và thêm các cột thiếu nếu có
-- Thêm cột is_active nếu chưa có
SET @column_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = 'gear_shop' 
    AND table_name = 'users' 
    AND column_name = 'is_active'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER role', 
    'SELECT "Cột is_active đã tồn tại" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột last_login nếu chưa có
SET @column_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = 'gear_shop' 
    AND table_name = 'users' 
    AND column_name = 'last_login'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL AFTER is_active', 
    'SELECT "Cột last_login đã tồn tại" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Thêm cột updated_at nếu chưa có
SET @column_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = 'gear_shop' 
    AND table_name = 'users' 
    AND column_name = 'updated_at'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at', 
    'SELECT "Cột updated_at đã tồn tại" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Kiểm tra cấu trúc bảng users sau khi cập nhật
DESCRIBE users;

-- Kiểm tra số lượng users hiện có
SELECT COUNT(*) as total_users FROM users;

-- Hiển thị một vài users mẫu (nếu có)
SELECT 
    user_id,
    full_name,
    email,
    role,
    is_active,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'Setup bảng users hoàn tất!' as message; 