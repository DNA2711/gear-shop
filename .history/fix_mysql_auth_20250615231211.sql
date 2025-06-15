-- Create user with mysql_native_password
CREATE USER IF NOT EXISTS 'gear_shop'@'localhost' IDENTIFIED WITH mysql_native_password BY 'gear_shop_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON gear_shop.* TO 'gear_shop'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show users
SELECT user, host, plugin FROM mysql.user WHERE user = 'gear_shop'; 