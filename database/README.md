# Database Setup for Gear Shop

## Mô tả

Thư mục này chứa các script SQL để thiết lập cơ sở dữ liệu cho Gear Shop.

## Các file script

### 1. `init_categories.sql`

- **Mục đích**: Tạo bảng `categories` nếu chưa tồn tại
- **An toàn**: Không xóa dữ liệu hiện có
- **Chức năng**: Kiểm tra và tạo cấu trúc bảng categories

### 2. `init_products.sql`

- **Mục đích**: Tạo bảng `products` nếu chưa tồn tại
- **Liên kết**: Có foreign key đến bảng `categories` và `brands`
- **Chức năng**: Tạo cấu trúc bảng products với đầy đủ index

### 3. `create_categories_table.sql`

- **Mục đích**: Tạo bảng categories và thêm dữ liệu mẫu hoàn chỉnh
- **Cảnh báo**: Script này sẽ XÓA dữ liệu cũ trong bảng categories
- **Nội dung**: Hơn 40+ categories mẫu với cấu trúc 3 level

## Hướng dẫn sử dụng

### Bước 1: Khởi tạo cấu trúc bảng (An toàn)

```sql
-- Chạy script khởi tạo an toàn
source init_categories.sql;
source init_products.sql;
```

### Bước 2: Thêm dữ liệu mẫu (Tùy chọn)

**Cảnh báo**: Script này sẽ xóa dữ liệu hiện có!

```sql
-- CHỈ chạy nếu muốn làm mới hoàn toàn dữ liệu categories
source create_categories_table.sql;
```

### Bước 3: Kiểm tra kết quả

```sql
-- Kiểm tra số lượng categories
SELECT COUNT(*) FROM categories;

-- Xem cấu trúc hierarchy
SELECT
    c1.category_name as main_category,
    c2.category_name as sub_category,
    c3.category_name as subsub_category
FROM categories c1
LEFT JOIN categories c2 ON c1.category_id = c2.parent_id
LEFT JOIN categories c3 ON c2.category_id = c3.parent_id
WHERE c1.parent_id IS NULL
ORDER BY c1.category_name, c2.category_name, c3.category_name;
```

## Cấu trúc Categories

Hệ thống hỗ trợ 3 cấp độ categories:

### Level 1 - Categories Chính (12 categories)

- CPU - Bộ Vi Xử Lý
- VGA - Card Đồ Họa
- Mainboard - Bo Mạch Chủ
- RAM - Bộ Nhớ
- Storage - Lưu Trữ
- PSU - Nguồn Máy Tính
- Cooling - Tản Nhiệt
- Case - Vỏ Máy Tính
- Monitor - Màn Hình
- Networking - Thiết Bị Mạng
- Peripherals - Phụ Kiện
- Gaming - Gaming Gear

### Level 2 - Sub-categories

Mỗi category chính có 2-5 sub-categories

### Level 3 - Sub-sub-categories

Một số sub-categories có thêm phân cấp chi tiết

## Lưu ý

1. **Thứ tự chạy script**: Luôn chạy `init_categories.sql` trước `init_products.sql`
2. **Foreign Keys**: Bảng products có liên kết đến categories và brands
3. **Indexes**: Các bảng đã được tối ưu với indexes phù hợp
4. **Data Types**: Sử dụng BIGINT cho ID để hỗ trợ quy mô lớn

## API Endpoints đã có

Sau khi setup database, các API sau sẽ hoạt động:

- `GET /api/categories` - Lấy danh sách categories
- `GET /api/categories?hierarchy=true` - Lấy categories theo cấu trúc tree
- `POST /api/categories` - Tạo category mới
- `GET /api/categories/[id]` - Lấy thông tin category
- `PUT /api/categories/[id]` - Cập nhật category
- `DELETE /api/categories/[id]` - Xóa category
- `PUT /api/categories/[id]/toggle-status` - Chuyển đổi trạng thái category
