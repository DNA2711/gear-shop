-- =====================================
-- FIX DATA TYPE INCONSISTENCIES
-- =====================================

USE gear_shop;

SELECT 'Fixing data type inconsistencies...' as message;

-- 1. Fix orders table user_id to match users table
-- Change INT to BIGINT for consistency
ALTER TABLE orders MODIFY COLUMN user_id BIGINT NOT NULL;

-- 2. Fix order_items table if needed
-- Check if product_id should be BIGINT (based on products table)
ALTER TABLE order_items MODIFY COLUMN order_id BIGINT NOT NULL;
ALTER TABLE order_items MODIFY COLUMN product_id BIGINT NOT NULL;

-- 3. Add proper foreign key constraints if missing
-- Drop existing constraints first (if any)
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.key_column_usage 
    WHERE table_schema = 'gear_shop' 
    AND table_name = 'orders' 
    AND constraint_name LIKE 'fk_%'
);

-- Add foreign key constraint for orders.user_id
SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE',
    'SELECT "Foreign key constraint already exists" as message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Add password reset columns to users table if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP NULL;

-- 5. Show table structures after fix
SELECT 'Table structures after fix:' as message;

DESCRIBE users;
DESCRIBE orders;
DESCRIBE notifications;

-- 6. Show foreign key relationships
SELECT 
    table_name,
    column_name,
    constraint_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'gear_shop'
AND referenced_table_name IS NOT NULL;

SELECT 'Data type fixes completed!' as message; 