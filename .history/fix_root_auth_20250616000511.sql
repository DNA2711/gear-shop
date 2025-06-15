-- Change root user authentication to mysql_native_password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show root user plugin
SELECT user, host, plugin FROM mysql.user WHERE user = 'root'; 