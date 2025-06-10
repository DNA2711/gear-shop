-- Sửa hoàn toàn lỗi encoding UTF-8

-- Thiết lập session encoding
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

-- Kiểm tra và sửa charset của bảng
ALTER TABLE product_specifications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Xóa dữ liệu cũ bị lỗi encoding
DELETE FROM product_specifications WHERE product_id = 11;

-- Thêm dữ liệu mới với encoding UTF-8 hoàn chỉnh
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(11, _utf8mb4'Sản phẩm', _utf8mb4'Card đồ họa VGA', 1),
(11, _utf8mb4'Hãng sản xuất', _utf8mb4'SAPPHIRE', 2),
(11, _utf8mb4'Engine đồ họa', _utf8mb4'AMD Radeon™ RX 7800 XT Graphics Card', 3),
(11, _utf8mb4'Chuẩn Bus', _utf8mb4'PCI-Express 4.0 x16', 4),
(11, _utf8mb4'Bộ nhớ', _utf8mb4'16GB GDDR6', 5),
(11, _utf8mb4'Engine Clock', _utf8mb4'Boost Clock: Up to 2565 MHz\nGame Clock: Up to 2254MHz', 6),
(11, _utf8mb4'Stream Processors', _utf8mb4'3840', 7),
(11, _utf8mb4'Clock bộ nhớ', _utf8mb4'', 8),
(11, _utf8mb4'Giao diện bộ nhớ', _utf8mb4'16GB/256 bit GDDR6', 9),
(11, _utf8mb4'Độ phân giải', _utf8mb4'HDMI™: 7680×4320\nDisplayPort 2.1: 7680×4320', 10),
(11, _utf8mb4'Kết nối', _utf8mb4'2x HDMI\n2x DisplayPort', 11),
(11, _utf8mb4'Kích thước', _utf8mb4'3 slot, ATX\nDimension: 320(L)X 134.85(W)X 61.57 (H)mm', 12),
(11, _utf8mb4'PSU đề nghị', _utf8mb4'700W', 13),
(11, _utf8mb4'Power Connectors', _utf8mb4'2 x 8-pin', 14),
(11, _utf8mb4'Phụ Kiện', _utf8mb4'1 x Quick Installation Guide', 15); 