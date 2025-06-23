-- =====================================
-- THÊM CÁC CỘT CHO CHỨC NĂNG RESET PASSWORD
-- =====================================

USE gear_shop;

-- Thêm các cột cho password reset vào bảng users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP NULL,
ADD INDEX IF NOT EXISTS idx_reset_token (reset_password_token);

SELECT 'Đã thêm các cột reset_password_token và reset_password_expires vào bảng users!' as message; 