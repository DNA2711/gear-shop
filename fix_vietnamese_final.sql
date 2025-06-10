-- Script để sửa hoàn toàn lỗi encoding tiếng Việt

-- 1. Thiết lập charset cho session
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

-- 2. Sửa charset của bảng
ALTER TABLE product_specifications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Xóa tất cả dữ liệu cũ bị lỗi encoding
DELETE FROM product_specifications WHERE product_id = 11;

-- 4. Thêm dữ liệu mới với encoding UTF-8 chính xác
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(11, 'Sản phẩm', 'Card đồ họa VGA', 1),
(11, 'Hãng sản xuất', 'SAPPHIRE', 2),
(11, 'Engine đồ họa', 'AMD Radeon™ RX 7800 XT Graphics Card', 3),
(11, 'Chuẩn Bus', 'PCI-Express 4.0 x16', 4),
(11, 'Bộ nhớ', '16GB GDDR6', 5),
(11, 'Engine Clock', 'Boost Clock: Up to 2565 MHz\nGame Clock: Up to 2254MHz', 6),
(11, 'Stream Processors', '3840', 7),
(11, 'Clock bộ nhớ', 'Effective: 19.5 Gbps', 8),
(11, 'Giao diện bộ nhớ', '16GB/256 bit GDDR6', 9),
(11, 'Độ phân giải', 'HDMI™: 7680×4320\nDisplayPort 2.1: 7680×4320', 10),
(11, 'Kết nối', '2x HDMI\n2x DisplayPort', 11),
(11, 'Kích thước', '3 slot, ATX\nDimension: 320(L)X 134.85(W)X 61.57 (H)mm', 12),
(11, 'PSU đề nghị', '700W', 13),
(11, 'Power Connectors', '2 x 8-pin', 14),
(11, 'Phụ kiện', '1 x Quick Installation Guide', 15); 