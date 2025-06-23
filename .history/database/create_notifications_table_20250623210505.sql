-- =====================================
-- TẠO BẢNG NOTIFICATIONS
-- =====================================

USE gear_shop;

-- Tạo bảng notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') NOT NULL DEFAULT 'info',
    category ENUM(
        'order_created',
        'order_updated', 
        'order_cancelled',
        'order_delivered',
        'payment_success',
        'payment_failed',
        'admin_new_order',
        'system',
        'promotion'
    ) NOT NULL,
    data JSON NULL COMMENT 'Additional data (order_id, etc.)',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at),
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_user_category (user_id, category)
);

-- Tạo bảng notification_settings để lưu cài đặt thông báo của user
CREATE TABLE IF NOT EXISTS notification_settings (
    setting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    order_updates BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT FALSE,
    new_products BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_user_id (user_id)
);

-- Tạo function để tự động tạo notification settings cho user mới
DELIMITER //
CREATE TRIGGER IF NOT EXISTS create_default_notification_settings
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO notification_settings (user_id)
    VALUES (NEW.user_id);
END//
DELIMITER ;

SELECT 'Bảng notifications và notification_settings đã được tạo thành công!' as message; 