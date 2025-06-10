-- Create product_specifications table
CREATE TABLE product_specifications (
  spec_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  spec_name VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_display_order (display_order)
);

-- Insert sample specifications for Intel Core i9-13900K (product_id = 1)
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(1, 'Bộ vi xử lý', 'Intel Core i9-13900K', 1),
(1, 'Số nhân/luồng', '24 nhân (8 P-core + 16 E-core) / 32 luồng', 2),
(1, 'Tốc độ cơ bản', '3.0 GHz P-core / 2.2 GHz E-core', 3),
(1, 'Tốc độ tối đa', '5.8 GHz P-core / 4.3 GHz E-core', 4),
(1, 'Bộ nhớ đệm', '36 MB Intel Smart Cache', 5),
(1, 'Công nghệ', '10nm Enhanced SuperFin (Intel 7)', 6),
(1, 'TDP', '125W (PL1) / 253W (PL2)', 7),
(1, 'Socket', 'LGA 1700', 8);

-- Insert sample specifications for VGA SAPPHIRE (product_id = 11)
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(11, 'GPU', 'AMD Radeon RX 7800 XT', 1),
(11, 'Bộ nhớ', '16GB GDDR6', 2),
(11, 'Bus nhớ', '256-bit', 3),
(11, 'Tốc độ nhớ', '19.5 Gbps', 4),
(11, 'Compute Units', '60 CUs', 5),
(11, 'Stream Processors', '3840', 6),
(11, 'Tốc độ GPU', 'Up to 2430 MHz', 7),
(11, 'DirectX', 'DirectX 12 Ultimate', 8),
(11, 'Kết nối', '3x DisplayPort 2.1, 1x HDMI 2.1', 9),
(11, 'Nguồn yêu cầu', '700W PSU', 10);

-- Insert sample specifications for Corsair DDR5 RAM (product_id = 12)
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(12, 'Dung lượng', '32GB (2x16GB)', 1),
(12, 'Loại RAM', 'DDR5', 2),
(12, 'Tốc độ', '5600 MHz', 3),
(12, 'Latency', 'CL36-38-38-84', 4),
(12, 'Điện áp', '1.25V', 5),
(12, 'LED RGB', 'Corsair iCUE RGB', 6),
(12, 'Tản nhiệt', 'Aluminum heat spreader', 7),
(12, 'Bảo hành', '10 năm', 8);

-- Insert sample specifications for Samsung SSD (product_id = 16)
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(16, 'Dung lượng', '2TB', 1),
(16, 'Giao tiếp', 'M.2 NVMe PCIe 4.0', 2),
(16, 'Tốc độ đọc', 'Up to 7,000 MB/s', 3),
(16, 'Tốc độ ghi', 'Up to 6,900 MB/s', 4),
(16, 'NAND Flash', 'Samsung V-NAND 3bit MLC', 5),
(16, 'Controller', 'Samsung Elpis Controller', 6),
(16, 'Bộ nhớ đệm', '2GB LPDDR4', 7),
(16, 'Bảo hành', '5 năm', 8);

-- Insert sample specifications for ASUS Motherboard (product_id = 21)
INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES
(21, 'Socket', 'LGA 1700', 1),
(21, 'Chipset', 'Intel Z790', 2),
(21, 'Hỗ trợ CPU', 'Intel 12th/13th Gen', 3),
(21, 'Bộ nhớ', '4x DDR5, tối đa 128GB', 4),
(21, 'Tốc độ RAM', 'Up to DDR5-7800+ (OC)', 5),
(21, 'Khe mở rộng', '3x PCIe 5.0 x16, 1x PCIe 4.0 x16', 6),
(21, 'M.2 Slots', '4x M.2 (PCIe 4.0)', 7),
(21, 'Mạng', 'Intel 2.5Gb LAN + WiFi 6E', 8),
(21, 'Audio', 'ROG SupremeFX 7.1', 9); 