# MÔ TẢ CÁC CHỨC NĂNG ĐÃ HOÀN THÀNH - HỆ THỐNG GEAR SHOP

## TỔNG QUAN HỆ THỐNG

Hệ thống **Gear Shop** là một trang web thương mại điện tử chuyên kinh doanh linh kiện máy tính và thiết bị công nghệ, được xây dựng bằng **Next.js 14**, **TypeScript** và **MySQL**.

---

## 1. CHỨC NĂNG HIỂN THỊ VÀ TÌM KIẾM SẢN PHẨM

### Mô tả chi tiết chức năng:

Đây là chức năng cốt lõi cho phép người dùng xem danh sách sản phẩm với khả năng lọc và tìm kiếm tiên tiến. Hệ thống hiển thị sản phẩm dưới dạng grid layout responsive với thông tin đầy đủ: hình ảnh, tên sản phẩm, giá bán, thương hiệu và trạng thái còn hàng.

### Cách sử dụng giao diện:

- **Trang danh sách sản phẩm** (`/products`): Hiển thị grid layout với các card sản phẩm
- **Thanh tìm kiếm**: Ở phía trên trang, người dùng nhập từ khóa và nhấn Enter hoặc nút tìm kiếm
- **Bộ lọc danh mục**: Hiển thị dạng grid với icon đại diện cho từng danh mục, click để chọn
- **Bộ lọc thương hiệu**: Grid layout hiển thị logo thương hiệu, click để lọc theo brand
- **Bộ lọc khoảng giá**: **6 nút bấm cố định** (không phải slider):
  - **Tất cả** (💰 icon)
  - **Dưới 1 triệu**
  - **1-5 triệu**
  - **5-10 triệu**
  - **10-20 triệu**
  - **Trên 20 triệu**
- **Hiển thị bộ lọc đang áp dụng**: Tags có thể xóa riêng lẻ hoặc xóa tất cả
- **Phân trang**: Điều hướng qua các trang với nút Previous/Next

### Tính năng kỹ thuật:

- Tích hợp API `/api/products` với query parameters
- Lưu trữ state filter trong URL để có thể bookmark
- Loading states và error handling
- Responsive design cho mobile/tablet

---

## 2. CHỨC NĂNG CHI TIẾT SẢN PHẨM

### Mô tả chi tiết chức năng:

Trang chi tiết sản phẩm hiển thị thông tin đầy đủ về một sản phẩm cụ thể bao gồm hình ảnh, mô tả, thông số kỹ thuật, giá cả và tính năng thêm vào giỏ hàng.

### Cách sử dụng giao diện:

- **Gallery hình ảnh**: Hình ảnh chính lớn với thumbnail bên dưới, click để xem
- **Thông tin sản phẩm**: Tên, mã sản phẩm, thương hiệu, giá gốc/giá sale
- **Thông số kỹ thuật**: Bảng hiển thị spec chi tiết (CPU, RAM, Storage, etc.)
- **Trạng thái kho**: Hiển thị số lượng còn lại
- **Nút thêm giỏ hàng**: Button lớn màu xanh với icon giỏ hàng
- **Sản phẩm liên quan**: Carousel hiển thị sản phẩm cùng danh mục
- **Breadcrumb**: Điều hướng ngược về danh mục/trang chủ

---

## 3. CHỨC NĂNG GIỎ HÀNG

### Mô tả chi tiết chức năng:

Hệ thống giỏ hàng cho phép người dùng thêm, sửa, xóa sản phẩm và quản lý các item trước khi thanh toán. Dữ liệu được lưu trong **localStorage** và đồng bộ với **CartContext**.

### Cách sử dụng giao diện:

- **Icon giỏ hàng**: Ở header, hiển thị số lượng items và có thể click để mở drawer
- **Cart Drawer**: Slide từ bên phải, hiển thị mini cart với quick actions
- **Trang giỏ hàng** (`/cart`):
  - Checkbox để chọn/bỏ chọn từng item
  - Checkbox "Chọn tất cả" để select/deselect toàn bộ
  - Nút tăng/giảm số lượng (+/-) cho mỗi sản phẩm
  - Nút xóa item (icon thùng rác)
  - Nút "Xóa tất cả" với modal xác nhận
  - **Tính phí ship tự động**:
    - Miễn phí ship nếu đơn ≥ 500,000đ
    - Giảm ship 15,000đ nếu đơn ≥ 200,000đ
    - Ship tiêu chuẩn 30,000đ
- **Nút "Thanh toán"**: Chỉ active khi có ít nhất 1 item được chọn

---

## 4. CHỨC NĂNG THANH TOÁN (CHECKOUT)

### Mô tả chi tiết chức năng:

Quy trình thanh toán hoàn chỉnh từ nhập thông tin giao hàng đến xác nhận đơn hàng với tích hợp cổng thanh toán **VNPay**.

### Cách sử dụng giao diện:

- **Form thông tin giao hàng**:
  - Họ tên (required)
  - Email (auto-fill từ user profile)
  - Số điện thoại (required, validate 10 số)
  - Địa chỉ giao hàng (required)
  - Thành phố
  - Ghi chú (optional)
- **Chọn phương thức thanh toán**: Radio button chọn VNPay
- **Hiển thị đơn hàng**: List các sản phẩm đã chọn với tổng tiền
- **Validation**:
  - Kiểm tra tổng tiền tối thiểu 5,000đ và tối đa dưới 1 tỷ đồng
  - Validate format số điện thoại
- **Nút "Đặt hàng"**: Tạo order và chuyển hướng đến VNPay

### Quy trình thanh toán VNPay:

1. Tạo đơn hàng trong database với status "PENDING"
2. Hiển thị QR code VNPay mock để scan thanh toán
3. Polling kiểm tra trạng thái thanh toán mỗi 3 giây
4. Chuyển đến trang success khi thanh toán thành công
5. Xóa items đã đặt khỏi giỏ hàng

---

## 5. CHỨC NĂNG QUẢN LÝ ĐỐN HÀNG (USER)

### Mô tả chi tiết chức năng:

Người dùng có thể xem lịch sử đơn hàng và theo dõi trạng thái giao hàng.

### Cách sử dụng giao diện:

- **Trang đơn hàng** (`/orders`): Danh sách đơn hàng theo thời gian
- **Thông tin đơn hàng**: Mã đơn, ngày đặt, tổng tiền, trạng thái
- **Chi tiết đơn hàng**: Click để xem list sản phẩm, địa chỉ giao hàng
- **Trạng thái đơn**: Pending → Processing → Shipped → Delivered
- **Lọc đơn hàng**: Theo trạng thái, thời gian

---

## 6. CHỨC NĂNG QUẢN LÝ TÀI KHOẢN

### Mô tả chi tiết chức năng:

Hệ thống authentication và quản lý profile người dùng.

### Cách sử dụng giao diện:

- **Đăng ký** (`/register`): Form với email, password, confirm password
- **Đăng nhập** (`/login`): Email/password với "Remember me"
- **Quên mật khẩu** (`/forgot-password`): Nhập email để reset
- **Profile** (`/profile`): Cập nhật thông tin cá nhân, số điện thoại
- **Đổi mật khẩu** (`/settings`): Form đổi password với validation
- **Avatar**: Upload và hiển thị ảnh đại diện
- **Dropdown menu**: Ở header với các tùy chọn profile/logout

---

## 7. CHỨC NĂNG ADMIN - QUẢN LÝ SẢN PHẨM

### Mô tả chi tiết chức năng:

Giao diện quản trị cho phép admin thêm, sửa, xóa sản phẩm với form phức tạp và upload nhiều hình ảnh.

### Cách sử dụng giao diện:

- **Trang danh sách** (`/admin/products`):

  - Bảng hiển thị products với search, filter
  - Nút "Thêm sản phẩm" mở modal
  - Actions: Edit (chuyển đến trang edit), Delete với confirm
  - Stats cards hiển thị tổng số sản phẩm, giá trị kho

- **Trang chỉnh sửa** (`/admin/products/[id]/edit`):

  - **Tab "Thông tin cơ bản"**:

    - Form fields: Tên, mã sản phẩm, danh mục, thương hiệu
    - Giá bán, giá gốc, số lượng tồn kho
    - Dropdown trạng thái: Đang hoạt động/Tạm dừng

  - **Tab "Thông số kỹ thuật"**:

    - Thêm spec mới: Input tên + giá trị
    - List specs có thể edit inline
    - Drag & drop để sắp xếp thứ tự
    - Nút xóa từng spec

  - **Tab "Hình ảnh"**:
    - Upload multiple files hoặc paste URL
    - Drag & drop để sắp xếp thứ tự
    - Ảnh đầu tiên tự động là ảnh chính
    - Preview real-time với nút xóa

- **Nút "Lưu"**: Validate và save tất cả thông tin
- **Nút "Xem trước"**: Mở trang sản phẩm trong tab mới

---

## 8. CHỨC NĂNG ADMIN - DASHBOARD VÀ THỐNG KÊ

### Mô tả chi tiết chức năng:

Trang tổng quan hiển thị các chỉ số kinh doanh và biểu đồ thống kê.

### Cách sử dụng giao diện:

- **Stats Cards**:
  - Tổng doanh thu
  - Số đơn hàng
  - Số sản phẩm
  - Số khách hàng
- **Biểu đồ doanh thu**: Chart theo ngày/tháng
- **Đơn hàng gần đây**: Bảng với quick actions
- **Top sản phẩm bán chạy**: List với số lượng bán

---

## 9. CHỨC NĂNG ADMIN - QUẢN LÝ ĐỐN HÀNG

### Mô tả chi tiết chức năng:

Quản lý và cập nhật trạng thái đơn hàng của khách.

### Cách sử dụng giao diện:

- **Bảng đơn hàng**: Hiển thị mã đơn, khách hàng, tổng tiền, trạng thái
- **Filter**: Theo trạng thái, ngày đặt, khách hàng
- **Chi tiết đơn hàng**: Modal/page hiển thị full info
- **Cập nhật trạng thái**: Dropdown để thay đổi status
- **In hóa đơn**: Export PDF đơn hàng

---

## 10. CHỨC NĂNG ADMIN - QUẢN LÝ DANH MỤC VÀ THƯƠNG HIỆU

### Mô tả chi tiết chức năng:

Quản lý categories và brands cho hệ thống.

### Cách sử dụng giao diện:

- **Quản lý danh mục** (`/admin/categories`):

  - Tree view hiển thị danh mục cha/con
  - Thêm/sửa/xóa với modal
  - Toggle trạng thái active/inactive
  - Upload icon cho danh mục

- **Quản lý thương hiệu** (`/admin/brands`):
  - Grid view hiển thị logo brands
  - Upload logo từ file hoặc URL
  - Thông tin: Tên, mô tả, website

---

## KẾT LUẬN

Hệ thống **Gear Shop** đã hoàn thành đầy đủ các chức năng cơ bản của một trang thương mại điện tử:

### Phía người dùng (Frontend):

- ✅ Tìm kiếm và lọc sản phẩm nâng cao
- ✅ Giỏ hàng và thanh toán hoàn chỉnh
- ✅ Quản lý tài khoản và đơn hàng
- ✅ Giao diện responsive, user-friendly

### Phía quản trị (Admin):

- ✅ Dashboard với thống kê chi tiết
- ✅ CRUD sản phẩm với upload hình ảnh
- ✅ Quản lý đơn hàng và khách hàng
- ✅ Quản lý danh mục, thương hiệu

### Tính năng kỹ thuật:

- ✅ Authentication & Authorization
- ✅ Real-time notifications
- ✅ Payment integration (VNPay)
- ✅ RESTful API design
- ✅ Responsive & Mobile-first design
- ✅ Error handling & Loading states
