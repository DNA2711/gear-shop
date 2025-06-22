# Hệ Thống Thông Báo - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống thông báo cho phép khách hàng nhận thông báo tự động khi trạng thái đơn hàng thay đổi, cùng với các loại thông báo khác như khuyến mãi và thông báo hệ thống.

## Cài Đặt

### 1. Tạo Database Table

Chạy file SQL để tạo bảng notifications:

```sql
mysql -u username -p gear_shop < database/create_notifications_table.sql
```

Hoặc chạy setup script:

```sql
mysql -u username -p gear_shop < setup_notifications.sql
```

### 2. Cấu Trúc Database

Bảng `notifications` có các trường:

- `id`: Primary key
- `user_id`: ID người dùng nhận thông báo
- `order_id`: ID đơn hàng (nullable)
- `type`: Loại thông báo (order_status, promotion, system, general)
- `title`: Tiêu đề thông báo
- `message`: Nội dung thông báo
- `status_from`: Trạng thái cũ của đơn hàng (nullable)
- `status_to`: Trạng thái mới của đơn hàng (nullable)
- `is_read`: Đã đọc hay chưa (mặc định FALSE)
- `created_at`: Thời gian tạo
- `updated_at`: Thời gian cập nhật

## Tính Năng

### 1. Thông Báo Tự Động Khi Thay Đổi Trạng Thái Đơn Hàng

Khi admin thay đổi trạng thái đơn hàng:
- ✅ **Đang xử lý**: "Đơn hàng đang được xử lý"
- ✅ **Đang giao hàng**: "Đơn hàng đang được giao"
- ✅ **Đã giao hàng**: "Đơn hàng đã được giao thành công"
- ✅ **Đã hủy**: "Đơn hàng đã bị hủy"

### 2. Hiển Thị Thông Báo

- **Header Bell Icon**: Hiển thị số lượng thông báo chưa đọc
- **Dropdown Menu**: Xem nhanh thông báo gần đây
- **Trang Notifications**: Xem đầy đủ danh sách thông báo

### 3. Quản Lý Thông Báo

- Đánh dấu đã đọc từng thông báo
- Đánh dấu tất cả đã đọc
- Lọc theo loại thông báo
- Auto-refresh mỗi 30 giây

## API Endpoints

### GET /api/notifications
Lấy danh sách thông báo của user hiện tại

**Query Parameters:**
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số lượng mỗi trang (mặc định: 20)
- `unread`: Chỉ lấy thông báo chưa đọc (true/false)

**Response:**
```json
{
  "notifications": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  },
  "stats": {
    "total": 50,
    "unread": 5
  }
}
```

### PATCH /api/notifications/[id]/read
Đánh dấu thông báo đã đọc

### PATCH /api/notifications/mark-all-read
Đánh dấu tất cả thông báo đã đọc

### POST /api/notifications
Tạo thông báo mới (chỉ admin)

## Components

### 1. NotificationContext
```tsx
import { useNotification } from "@/contexts/NotificationContext";

const { notifications, stats, markAsRead } = useNotification();
```

### 2. NotificationDropdown
```tsx
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

// Được sử dụng trong header
{user && <NotificationDropdown />}
```

## Cách Thức Hoạt Động

### 1. Khi Admin Thay Đổi Trạng thái Đơn Hàng:

1. **Admin clicks** select box để thay đổi trạng thái
2. **API call** đến `/api/admin/orders` (PATCH)
3. **Update order** trong database
4. **Auto-create notification** cho khách hàng
5. **Notification appears** trong header bell của khách hàng

### 2. Khi Khách Hàng Xem Thông Báo:

1. **Bell icon** hiển thị số thông báo chưa đọc
2. **Click bell** mở dropdown với thông báo gần đây
3. **Click notification** đánh dấu đã đọc
4. **Click "Xem tất cả"** chuyển đến trang notifications

## Tùy Chỉnh

### Thêm Loại Thông Báo Mới

1. **Update type definition** trong `src/types/notification.ts`:
```tsx
type: "order_status" | "promotion" | "system" | "general" | "new_type";
```

2. **Add icon mapping** trong NotificationDropdown và NotificationsPage:
```tsx
case "new_type":
  return <YourIcon className="w-4 h-4 text-your-color" />;
```

3. **Create notification** với type mới:
```tsx
await createNotification({
  user_id: userId,
  type: "new_type",
  title: "Your Title",
  message: "Your Message"
});
```

### Thêm Thông Báo Cho Sự Kiện Khác

1. **Import utility** function:
```tsx
import { createOrderStatusNotification } from "@/lib/notificationUtils";
```

2. **Call notification** trong event handler:
```tsx
await createOrderStatusNotification(userId, orderId, fromStatus, toStatus);
```

## Testing

### Test Notification System

1. **Login as customer**
2. **Place an order**
3. **Login as admin**
4. **Change order status** in admin panel
5. **Check notification** in customer header bell

### Test Data

Chạy setup script sẽ tạo sample notification để test.

## Troubleshooting

### Thông Báo Không Hiển Thị

1. Check console for API errors
2. Verify user is logged in
3. Check notification table có data không
4. Verify NotificationProvider is wrapped properly

### Auto-refresh Không Hoạt Động

1. Check localStorage có accessToken không
2. Verify interval không bị clear
3. Check network connectivity

### Notification Không Được Tạo

1. Check admin order update API
2. Verify createOrderStatusNotification được call
3. Check database permissions
4. Verify foreign key constraints

## Security

- **Authorization**: Chỉ user được phép xem thông báo của mình
- **Admin only**: Chỉ admin có thể tạo thông báo manual
- **SQL Injection**: Sử dụng prepared statements
- **Rate limiting**: Consider thêm rate limiting cho API

## Performance

- **Pagination**: API hỗ trợ pagination
- **Auto-refresh**: Chỉ refresh stats, không fetch full list
- **Indexing**: Database có index cho các query thường dùng
- **Caching**: Consider Redis cache cho high traffic 