# Hướng Dẫn Setup Dự Án Gear Shop

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

- **Node.js**: Version 18.0 hoặc cao hơn
- **npm**: Version 8.0 hoặc cao hơn
- **MySQL Server**: Version 8.0 hoặc cao hơn
- **Git**: Để clone repository

### Kiểm Tra Version

```bash
node --version
npm --version
mysql --version
git --version
```

## Bước 1: Cài Đặt MySQL Server

### Windows

1. Tải MySQL Server từ [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)
2. Chạy installer, chọn "Developer Default"
3. Cài đặt với các tùy chọn mặc định
4. Thiết lập root password (nhớ password này)
5. Khởi động MySQL service

### macOS

```bash
# Sử dụng Homebrew
brew install mysql
brew services start mysql

# Thiết lập root password
mysql_secure_installation
```

### Ubuntu/Linux

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

## Bước 2: Setup Database

### Kết nối MySQL

```bash
mysql -u root -p
```

### Tạo Database và User

```sql
-- Tạo database
CREATE DATABASE gear_shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (tuỳ chọn)
CREATE USER 'gear_shop_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON gear_shop.* TO 'gear_shop_user'@'localhost';
FLUSH PRIVILEGES;

-- Sử dụng database
USE gear_shop;
```

## Bước 3: Clone và Cài Đặt Project

### Clone Repository

```bash
git clone <repository-url>
cd gear-shop
```

### Cài Đặt Dependencies

```bash
npm install
```

### Cấu Hình Environment

Tạo file `.env.local` trong thư mục gốc:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gear_shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Optional: Upload Configuration
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5242880
```

## Bước 4: Setup Database Tables

### Chạy Các Script Setup

Trong thư mục `database/`, chạy các script theo thứ tự:

```bash
# Kết nối MySQL
mysql -u root -p gear_shop

# Trong MySQL prompt:
source database/setup_all.sql;
source database/init_categories.sql;
source database/init_products.sql;
```

### Hoặc Chạy Từng Script

```sql
-- 1. Tạo bảng cơ bản
source database/create_table_only.sql;

-- 2. Tạo bảng users
source database/check_users_table.sql;

-- 3. Tạo bảng orders
source database/create_orders_table.sql;

-- 4. Tạo bảng specifications
source create_specifications_table.sql;

-- 5. Khởi tạo categories
source database/init_categories.sql;

-- 6. Khởi tạo products
source database/init_products.sql;

-- 7. Thêm sample data (tuỳ chọn)
source database/sample_products.sql;
```

## Bước 5: Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Bước 6: Kiểm Tra Setup

### Kiểm Tra Database

```sql
-- Kiểm tra các bảng đã tạo
SHOW TABLES;

-- Kiểm tra dữ liệu categories
SELECT * FROM categories LIMIT 5;

-- Kiểm tra dữ liệu products
SELECT * FROM products LIMIT 5;

-- Kiểm tra encoding
SHOW VARIABLES LIKE 'character_set_%';
```

### Kiểm Tra API Endpoints

Truy cập các URL sau để kiểm tra:

- **Homepage**: http://localhost:3000
- **API Health**: http://localhost:3000/api/test
- **Products API**: http://localhost:3000/api/products
- **Categories API**: http://localhost:3000/api/categories
- **Admin Panel**: http://localhost:3000/admin

### Kiểm Tra Tính Năng

1. **Authentication**: Đăng ký/đăng nhập tài khoản
2. **Products**: Xem danh sách sản phẩm
3. **Cart**: Thêm sản phẩm vào giỏ hàng
4. **Admin**: Truy cập trang admin (cần tài khoản admin)

## Troubleshooting

### Lỗi Database Connection

```bash
# Kiểm tra MySQL service
# Windows
net start mysql

# macOS/Linux
sudo systemctl status mysql
brew services list | grep mysql
```

### Lỗi "Access denied for user"

```sql
-- Reset password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
```

### Lỗi "Database doesn't exist"

```sql
-- Tạo lại database
CREATE DATABASE gear_shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Lỗi Character Set

```sql
-- Cập nhật character set
ALTER DATABASE gear_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Lỗi Module Not Found

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Lỗi Port Already in Use

```bash
# Tìm process đang dùng port 3000
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Tạo Tài Khoản Admin

### Tạo User Admin Đầu Tiên

```sql
-- Thêm user admin vào database
INSERT INTO users (email, password, full_name, role, created_at, updated_at)
VALUES (
    'admin@gearshop.com',
    '$2b$10$hash_password_here',
    'Admin User',
    'admin',
    NOW(),
    NOW()
);
```

### Hoặc Sử Dụng API

```bash
# POST request tới /api/auth/register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gearshop.com",
    "password": "admin123456",
    "fullName": "Admin User"
  }'
```

## Cấu Hình Thêm

### Upload Files

Tạo thư mục uploads:

```bash
mkdir -p public/uploads/products
mkdir -p public/uploads/brands
```

### Database Backup

```bash
# Backup database
mysqldump -u root -p gear_shop > backup.sql

# Restore database
mysql -u root -p gear_shop < backup.sql
```

## Checklist Setup

- [ ] MySQL Server đã cài đặt và chạy
- [ ] Node.js và npm đã cài đặt
- [ ] Repository đã clone thành công
- [ ] Dependencies đã cài đặt (`npm install`)
- [ ] File `.env.local` đã tạo và cấu hình
- [ ] Database `gear_shop` đã tạo
- [ ] Các bảng database đã tạo thành công
- [ ] Dữ liệu mẫu đã import
- [ ] Ứng dụng chạy thành công (`npm run dev`)
- [ ] Có thể truy cập homepage
- [ ] API endpoints hoạt động
- [ ] Tài khoản admin đã tạo
- [ ] Các tính năng cơ bản hoạt động

## Hỗ Trợ

Nếu gặp vấn đề trong quá trình setup:

1. Kiểm tra logs trong terminal
2. Kiểm tra MySQL error logs
3. Kiểm tra file `.env.local` có đúng cấu hình
4. Kiểm tra version của Node.js và MySQL
5. Đảm bảo tất cả dependencies đã cài đặt
6. Kiểm tra firewall và antivirus không block port 3000

## Cập Nhật Dự Án

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Restart application
npm run dev
```

---

**Lưu ý**: Thay thế `<repository-url>` bằng URL thực tế của repository và cập nhật các thông tin cấu hình theo môi trường cụ thể của bạn.
