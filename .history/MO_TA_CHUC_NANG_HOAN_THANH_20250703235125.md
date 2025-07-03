# MÔ TẢ CHI TIẾT CÁC CHỨC NĂNG ĐÃ HOÀN THÀNH CỦA HỆ THỐNG GEAR SHOP

Gear Shop là hệ thống thương mại điện tử chuyên về linh kiện máy tính, được xây dựng với mục tiêu mang lại trải nghiệm mua sắm hiện đại, tiện lợi và minh bạch cho người dùng. Dưới đây là mô tả chi tiết, rõ ràng, rành mạch về các chức năng đã hoàn thiện trong hệ thống.

---

## 1. Hiển thị và lọc danh sách sản phẩm

### Mục đích

Giúp người dùng dễ dàng tìm kiếm, duyệt và lựa chọn sản phẩm phù hợp thông qua các bộ lọc trực quan.

### Mô tả chi tiết

- **Danh sách sản phẩm**: Hiển thị dạng lưới (grid), mỗi sản phẩm là một thẻ với hình ảnh, tên, giá, thương hiệu, trạng thái kho.
- **Thanh tìm kiếm**: Nhập từ khóa để lọc nhanh sản phẩm.
- **Bộ lọc danh mục**: Các nút hoặc icon đại diện cho từng nhóm sản phẩm, bấm để lọc.
- **Bộ lọc thương hiệu**: Hiển thị logo, bấm để lọc theo thương hiệu.
- **Bộ lọc khoảng giá**: 6 nút bấm cố định (KHÔNG phải slider):
  1. Tất cả (💰)
  2. Dưới 1 triệu
  3. 1-5 triệu
  4. 5-10 triệu
  5. 10-20 triệu
  6. Trên 20 triệu
- **Hiển thị bộ lọc đang áp dụng**: Dưới dạng thẻ, có thể xóa từng bộ lọc hoặc tất cả.
- **Phân trang**: Chuyển trang bằng nút hoặc số trang.
- **Responsive**: Hiển thị tốt trên cả máy tính và điện thoại.

### Quy trình sử dụng

1. Truy cập trang sản phẩm.
2. Nhập từ khóa, chọn danh mục, thương hiệu, khoảng giá.
3. Danh sách sản phẩm cập nhật ngay theo bộ lọc.
4. Xóa bộ lọc nếu muốn xem lại toàn bộ.

---

## 2. Xem chi tiết sản phẩm

### Mục đích

Cung cấp đầy đủ thông tin về sản phẩm để người dùng đưa ra quyết định mua hàng.

### Mô tả chi tiết

- **Gallery hình ảnh**: Ảnh lớn, có thể chuyển đổi giữa các ảnh.
- **Thông tin sản phẩm**: Tên, mã, thương hiệu, giá bán, giá gốc, trạng thái kho.
- **Thông số kỹ thuật**: Bảng chi tiết các thông số (CPU, RAM, dung lượng, ...).
- **Nút thêm vào giỏ hàng**: Nổi bật, dễ thao tác.
- **Sản phẩm liên quan**: Hiển thị các sản phẩm cùng danh mục.
- **Breadcrumb**: Điều hướng về danh mục hoặc trang chủ.

### Quy trình sử dụng

1. Bấm vào sản phẩm bất kỳ trong danh sách.
2. Xem chi tiết, chuyển ảnh, đọc thông số.
3. Thêm vào giỏ hàng nếu muốn mua.

---

## 3. Giỏ hàng

### Mục đích

Quản lý các sản phẩm người dùng muốn mua trước khi thanh toán.

### Mô tả chi tiết

- **Icon giỏ hàng**: Ở header, hiển thị số lượng sản phẩm.
- **Cart Drawer**: Mở nhanh giỏ hàng từ mọi trang.
- **Trang giỏ hàng**:
  - Checkbox chọn từng sản phẩm hoặc chọn tất cả.
  - Nút tăng/giảm số lượng từng sản phẩm.
  - Nút xóa sản phẩm hoặc xóa toàn bộ (có xác nhận).
  - Tính phí ship tự động:
    - Miễn phí nếu tổng ≥ 500.000đ
    - Giảm phí nếu tổng ≥ 200.000đ
    - Phí tiêu chuẩn 30.000đ
  - Hiển thị tổng tiền, phí ship, tổng thanh toán.
- **Nút "Thanh toán"**: Chỉ bật khi có sản phẩm được chọn.
- **Dữ liệu lưu localStorage**: Không mất khi reload trang.

### Quy trình sử dụng

1. Thêm sản phẩm vào giỏ hàng.
2. Vào trang giỏ hàng để kiểm tra, chỉnh sửa số lượng, xóa sản phẩm.
3. Chọn sản phẩm muốn thanh toán, bấm "Thanh toán".

---

## 4. Thanh toán (Checkout)

### Mục đích

Giúp người dùng hoàn tất đơn hàng và thanh toán trực tuyến an toàn.

### Mô tả chi tiết

- **Form thông tin giao hàng**:
  - Họ tên, email, số điện thoại, địa chỉ, thành phố, ghi chú.
  - Tự động điền thông tin nếu đã đăng nhập.
  - Kiểm tra số điện thoại đúng 10 số.
- **Chọn phương thức thanh toán**: Hiện tại hỗ trợ VNPay (radio button).
- **Hiển thị đơn hàng**: Danh sách sản phẩm, tổng tiền, phí ship.
- **Kiểm tra điều kiện thanh toán**:
  - Tổng tiền tối thiểu 5.000đ, tối đa dưới 1 tỷ đồng.
- **Nút "Đặt hàng"**: Tạo đơn hàng, chuyển hướng đến VNPay.
- **Quy trình VNPay**:
  1. Tạo đơn hàng trạng thái "PENDING".
  2. Hiển thị QR code để thanh toán.
  3. Tự động kiểm tra trạng thái thanh toán (polling).
  4. Khi thành công, chuyển đến trang xác nhận, xóa sản phẩm đã mua khỏi giỏ hàng.

### Quy trình sử dụng

1. Chọn sản phẩm, vào giỏ hàng, bấm "Thanh toán".
2. Nhập thông tin giao hàng, chọn phương thức thanh toán.
3. Xác nhận và thực hiện thanh toán qua VNPay.
4. Nhận thông báo thành công, kiểm tra đơn hàng.

---

## 5. Quản lý đơn hàng (người dùng)

### Mục đích

Giúp người dùng theo dõi lịch sử mua hàng và trạng thái giao hàng.

### Mô tả chi tiết

- **Trang đơn hàng**: Danh sách các đơn đã đặt, sắp xếp theo thời gian.
- **Thông tin đơn hàng**: Mã đơn, ngày đặt, tổng tiền, trạng thái (Pending, Đang xử lý, Đã giao, ...).
- **Chi tiết đơn hàng**: Xem danh sách sản phẩm, địa chỉ giao hàng, trạng thái từng sản phẩm.
- **Lọc đơn hàng**: Theo trạng thái, thời gian.

### Quy trình sử dụng

1. Đăng nhập, vào mục "Đơn hàng của tôi".
2. Xem danh sách, bấm vào từng đơn để xem chi tiết.
3. Theo dõi trạng thái giao hàng.

---

## 6. Quản lý tài khoản người dùng

### Mục đích

Đảm bảo an toàn, bảo mật và cho phép người dùng tự quản lý thông tin cá nhân.

### Mô tả chi tiết

- **Đăng ký**: Nhập email, mật khẩu, xác nhận mật khẩu.
- **Đăng nhập**: Email, mật khẩu, có "Nhớ đăng nhập".
- **Quên mật khẩu**: Nhập email để nhận link đặt lại mật khẩu.
- **Profile**: Cập nhật họ tên, số điện thoại, địa chỉ, avatar.
- **Đổi mật khẩu**: Nhập mật khẩu cũ, mật khẩu mới, xác nhận.
- **Dropdown menu**: Ở header, truy cập nhanh profile, đơn hàng, đăng xuất.

### Quy trình sử dụng

1. Đăng ký/đăng nhập tài khoản.
2. Vào trang cá nhân để cập nhật thông tin.
3. Đổi mật khẩu khi cần thiết.

---

## 7. Quản trị viên (Admin) - Quản lý sản phẩm

### Mục đích

Cho phép admin thêm, sửa, xóa sản phẩm, quản lý thông tin chi tiết và hình ảnh.

### Mô tả chi tiết

- **Trang danh sách sản phẩm**: Bảng liệt kê, tìm kiếm, lọc theo danh mục, thương hiệu, trạng thái.
- **Thêm sản phẩm**: Mở modal nhập thông tin, upload nhiều ảnh.
- **Sửa sản phẩm**: Chỉnh sửa thông tin, thông số kỹ thuật, hình ảnh (drag & drop sắp xếp ảnh/specs).
- **Xóa sản phẩm**: Có xác nhận trước khi xóa.
- **Xem trước sản phẩm**: Mở trang chi tiết ở tab mới.

### Quy trình sử dụng

1. Đăng nhập admin, vào mục quản lý sản phẩm.
2. Thêm mới, chỉnh sửa, xóa sản phẩm theo nhu cầu.

---

## 8. Quản trị viên (Admin) - Dashboard & Thống kê

### Mục đích

Cung cấp cái nhìn tổng quan về hoạt động kinh doanh.

### Mô tả chi tiết

- **Thẻ thống kê**: Tổng doanh thu, số đơn hàng, số sản phẩm, số khách hàng.
- **Biểu đồ doanh thu**: Theo ngày, tháng.
- **Đơn hàng gần đây**: Danh sách đơn mới nhất.
- **Top sản phẩm bán chạy**: Hiển thị số lượng bán.

### Quy trình sử dụng

1. Đăng nhập admin, vào dashboard.
2. Theo dõi các chỉ số, biểu đồ để đánh giá hiệu quả kinh doanh.

---

## 9. Quản trị viên (Admin) - Quản lý đơn hàng

### Mục đích

Theo dõi, cập nhật trạng thái đơn hàng của khách hàng.

### Mô tả chi tiết

- **Bảng đơn hàng**: Hiển thị mã đơn, khách hàng, tổng tiền, trạng thái.
- **Lọc đơn hàng**: Theo trạng thái, ngày đặt, khách hàng.
- **Chi tiết đơn hàng**: Xem thông tin đầy đủ, sản phẩm, địa chỉ giao hàng.
- **Cập nhật trạng thái**: Dropdown thay đổi trạng thái đơn (Pending, Đang xử lý, Đã giao...)
- **In hóa đơn**: Xuất PDF đơn hàng.

### Quy trình sử dụng

1. Vào mục quản lý đơn hàng.
2. Xem, lọc, cập nhật trạng thái từng đơn.
3. In hóa đơn khi cần.

---

## 10. Quản trị viên (Admin) - Quản lý danh mục & thương hiệu

### Mục đích

Tổ chức, phân loại sản phẩm và thương hiệu một cách khoa học.

### Mô tả chi tiết

- **Quản lý danh mục**: Tree view hiển thị cha/con, thêm/sửa/xóa, upload icon, bật/tắt trạng thái.
- **Quản lý thương hiệu**: Grid view logo, thêm/sửa/xóa, upload logo, nhập mô tả, website.

### Quy trình sử dụng

1. Vào mục quản lý danh mục/thương hiệu.
2. Thêm mới, chỉnh sửa, xóa, cập nhật trạng thái.

---

## Kết luận

Hệ thống Gear Shop đã hoàn thiện đầy đủ các chức năng cần thiết cho một website thương mại điện tử hiện đại, đảm bảo trải nghiệm người dùng tốt, quản trị dễ dàng, vận hành hiệu quả và bảo mật cao.
