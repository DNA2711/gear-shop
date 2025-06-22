-- =====================================
-- TẠO BẢNG NOTIFICATIONS
-- =====================================

USE gear_shop;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'order_status, promotion, system, etc.',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status_from VARCHAR(50) NULL COMMENT 'Trạng thái cũ của đơn hàng',
    status_to VARCHAR(50) NULL COMMENT 'Trạng thái mới của đơn hàng',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Kiểm tra bảng đã tạo thành công
SELECT 
    COUNT(*) as notification_count,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Bảng notifications đã tạo thành công và trống'
        ELSE 'Bảng notifications đã có dữ liệu'
    END as status
FROM notifications;

-- Xem cấu trúc bảng
DESCRIBE notifications; 