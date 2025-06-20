-- =====================================
-- THÊM SẢN PHẨM CÔNG NGHỆ THỰC TẾ
-- =====================================

USE gear_shop;

-- =====================================
-- 1. CPU INTEL & AMD
-- =====================================

INSERT INTO products (product_name, product_code, brand_id, category_id, description, price, sale_price, stock_quantity, image_urls, specifications, is_featured, is_active) VALUES

-- Intel CPU
('Intel Core i9-14900K', 'CPU-I9-14900K', 1, 1, 
'CPU Intel Core i9-14900K thế hệ 14 với 24 nhân (8P+16E), 32 luồng, xung nhịp boost 6.0GHz. Hiệu năng vượt trội cho gaming và workstation.', 
13990000, 12990000, 15,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "24 (8P+16E)", "threads": "32", "base_clock": "3.2GHz", "boost_clock": "6.0GHz", "cache": "36MB", "socket": "LGA1700", "tdp": "125W", "process": "Intel 7", "integrated_graphics": "Intel UHD Graphics 770"}',
true, true),

('Intel Core i7-14700K', 'CPU-I7-14700K', 1, 1,
'CPU Intel Core i7-14700K với 20 nhân (8P+12E), 28 luồng, xung nhịp boost 5.6GHz. Lựa chọn tuyệt vời cho gaming cao cấp.',
10990000, 9990000, 25,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "20 (8P+12E)", "threads": "28", "base_clock": "3.4GHz", "boost_clock": "5.6GHz", "cache": "33MB", "socket": "LGA1700", "tdp": "125W", "process": "Intel 7", "integrated_graphics": "Intel UHD Graphics 770"}',
true, true),

('Intel Core i5-14600K', 'CPU-I5-14600K', 1, 1,
'CPU Intel Core i5-14600K với 14 nhân (6P+8E), 20 luồng. Hiệu năng mạnh mẽ với giá hợp lý cho game thủ.',
7990000, 7490000, 30,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "14 (6P+8E)", "threads": "20", "base_clock": "3.5GHz", "boost_clock": "5.3GHz", "cache": "24MB", "socket": "LGA1700", "tdp": "125W", "process": "Intel 7", "integrated_graphics": "Intel UHD Graphics 770"}',
false, true),

-- AMD CPU
('AMD Ryzen 9 7950X', 'CPU-R9-7950X', 2, 1,
'CPU AMD Ryzen 9 7950X với 16 nhân, 32 luồng trên kiến trúc Zen 4. Hiệu năng đỉnh cao cho content creation và gaming.',
14990000, 13990000, 20,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "16", "threads": "32", "base_clock": "4.5GHz", "boost_clock": "5.7GHz", "cache": "80MB", "socket": "AM5", "tdp": "170W", "process": "5nm", "integrated_graphics": "AMD Radeon Graphics"}',
true, true),

('AMD Ryzen 7 7800X3D', 'CPU-R7-7800X3D', 2, 1,
'CPU AMD Ryzen 7 7800X3D với công nghệ 3D V-Cache. Hiệu năng gaming vượt trội nhất hiện tại.',
12990000, 11990000, 18,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "8", "threads": "16", "base_clock": "4.2GHz", "boost_clock": "5.0GHz", "cache": "104MB", "socket": "AM5", "tdp": "120W", "process": "5nm", "3d_vcache": "96MB", "integrated_graphics": "AMD Radeon Graphics"}',
true, true),

('AMD Ryzen 5 7600X', 'CPU-R5-7600X', 2, 1,
'CPU AMD Ryzen 5 7600X với 6 nhân, 12 luồng. Hiệu năng tuyệt vời cho gaming mainstream.',
6990000, 6490000, 35,
'["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"cores": "6", "threads": "12", "base_clock": "4.7GHz", "boost_clock": "5.3GHz", "cache": "38MB", "socket": "AM5", "tdp": "105W", "process": "5nm", "integrated_graphics": "AMD Radeon Graphics"}',
false, true),

-- =====================================
-- 2. VGA NVIDIA & AMD
-- =====================================

-- NVIDIA RTX 40 Series
('NVIDIA GeForce RTX 4090', 'VGA-RTX4090', 3, 2,
'Card đồ họa flagship RTX 4090 với 24GB GDDR6X. Hiệu năng 4K gaming và ray tracing đỉnh cao.',
41990000, 39990000, 8,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"cuda_cores": "16384", "memory": "24GB GDDR6X", "memory_bus": "384-bit", "boost_clock": "2520 MHz", "memory_clock": "21000 MHz", "power": "450W", "outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1", "ray_tracing": "3rd Gen", "dlss": "3.0"}',
true, true),

('NVIDIA GeForce RTX 4080', 'VGA-RTX4080', 3, 2,
'Card đồ họa RTX 4080 với 16GB GDDR6X. Hiệu năng 4K gaming mạnh mẽ với giá hợp lý hơn.',
28990000, 27490000, 12,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"cuda_cores": "9728", "memory": "16GB GDDR6X", "memory_bus": "256-bit", "boost_clock": "2505 MHz", "memory_clock": "22400 MHz", "power": "320W", "outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1", "ray_tracing": "3rd Gen", "dlss": "3.0"}',
true, true),

('NVIDIA GeForce RTX 4070 Ti', 'VGA-RTX4070TI', 3, 2,
'Card đồ họa RTX 4070 Ti với 12GB GDDR6X. Hiệu năng 1440p gaming tuyệt vời.',
18990000, 17990000, 15,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"cuda_cores": "7680", "memory": "12GB GDDR6X", "memory_bus": "192-bit", "boost_clock": "2610 MHz", "memory_clock": "21000 MHz", "power": "285W", "outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1", "ray_tracing": "3rd Gen", "dlss": "3.0"}',
false, true),

('NVIDIA GeForce RTX 4060 Ti', 'VGA-RTX4060TI', 3, 2,
'Card đồ họa RTX 4060 Ti với 16GB GDDR6. Lựa chọn tốt cho gaming 1440p.',
12990000, 11990000, 20,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"cuda_cores": "4352", "memory": "16GB GDDR6", "memory_bus": "128-bit", "boost_clock": "2540 MHz", "memory_clock": "18000 MHz", "power": "165W", "outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1", "ray_tracing": "3rd Gen", "dlss": "3.0"}',
false, true),

-- AMD RX 7000 Series
('AMD Radeon RX 7900 XTX', 'VGA-RX7900XTX', 2, 2,
'Card đồ họa flagship RX 7900 XTX với 24GB GDDR6. Hiệu năng 4K mạnh mẽ từ AMD.',
23990000, 22490000, 10,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"stream_processors": "6144", "memory": "24GB GDDR6", "memory_bus": "384-bit", "boost_clock": "2500 MHz", "memory_clock": "20000 MHz", "power": "355W", "outputs": "2x DisplayPort 2.1, 2x HDMI 2.1", "rdna": "3.0"}',
true, true),

('AMD Radeon RX 7800 XT', 'VGA-RX7800XT', 2, 2,
'Card đồ họa RX 7800 XT với 16GB GDDR6. Hiệu năng 1440p xuất sắc.',
14990000, 13990000, 15,
'["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400", "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400"]',
'{"stream_processors": "3840", "memory": "16GB GDDR6", "memory_bus": "256-bit", "boost_clock": "2430 MHz", "memory_clock": "19500 MHz", "power": "263W", "outputs": "2x DisplayPort 2.1, 2x HDMI 2.1", "rdna": "3.0"}',
false, true),

-- =====================================
-- 3. RAM DDR5 & DDR4
-- =====================================

-- DDR5 RAM
('Corsair Dominator Platinum RGB 32GB DDR5-6000', 'RAM-CORSAIR-DDR5-32GB', 4, 4,
'Bộ nhớ DDR5 cao cấp Corsair Dominator Platinum RGB 32GB (2x16GB) với tốc độ 6000MHz. RGB đẹp mắt và hiệu năng tuyệt vời.',
6990000, 6490000, 25,
'["https://images.unsplash.com/photo-1541029071515-84cc360b4c2b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "32GB (2x16GB)", "speed": "DDR5-6000", "latency": "CL36", "voltage": "1.35V", "rgb": "Yes", "heatspreader": "Aluminum", "warranty": "Lifetime"}',
true, true),

('G.Skill Trident Z5 RGB 32GB DDR5-5600', 'RAM-GSKILL-DDR5-32GB', 5, 4,
'Bộ nhớ DDR5 G.Skill Trident Z5 RGB 32GB (2x16GB) với tốc độ 5600MHz. Thiết kế RGB đẹp mắt.',
5990000, 5490000, 30,
'["https://images.unsplash.com/photo-1541029071515-84cc360b4c2b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "32GB (2x16GB)", "speed": "DDR5-5600", "latency": "CL36", "voltage": "1.25V", "rgb": "Yes", "heatspreader": "Aluminum", "warranty": "Lifetime"}',
false, true),

('Kingston Fury Beast 16GB DDR5-5200', 'RAM-KINGSTON-DDR5-16GB', 6, 4,
'Bộ nhớ DDR5 Kingston Fury Beast 16GB (2x8GB) với tốc độ 5200MHz. Lựa chọn hợp lý cho mainstream.',
2990000, 2790000, 40,
'["https://images.unsplash.com/photo-1541029071515-84cc360b4c2b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "16GB (2x8GB)", "speed": "DDR5-5200", "latency": "CL40", "voltage": "1.25V", "rgb": "No", "heatspreader": "Aluminum", "warranty": "Lifetime"}',
false, true),

-- DDR4 RAM
('Corsair Vengeance LPX 32GB DDR4-3600', 'RAM-CORSAIR-DDR4-32GB', 4, 4,
'Bộ nhớ DDR4 Corsair Vengeance LPX 32GB (2x16GB) với tốc độ 3600MHz. Thiết kế low-profile, tản nhiệt tốt.',
3490000, 3190000, 35,
'["https://images.unsplash.com/photo-1541029071515-84cc360b4c2b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "32GB (2x16GB)", "speed": "DDR4-3600", "latency": "CL18", "voltage": "1.35V", "rgb": "No", "heatspreader": "Aluminum", "warranty": "Lifetime"}',
false, true),

-- =====================================
-- 4. STORAGE - SSD & HDD
-- =====================================

-- NVMe SSD
('Samsung 980 PRO 2TB NVMe PCIe 4.0', 'SSD-SAMSUNG-980PRO-2TB', 7, 5,
'Ổ cứng SSD NVMe Samsung 980 PRO 2TB PCIe 4.0. Tốc độ đọc lên đến 7,000MB/s, hiệu năng cao cho gaming và workstation.',
4990000, 4490000, 20,
'["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "2TB", "interface": "PCIe 4.0 x4 NVMe", "read_speed": "7000 MB/s", "write_speed": "5100 MB/s", "form_factor": "M.2 2280", "warranty": "5 years", "nand": "3D V-NAND"}',
true, true),

('WD Black SN850X 1TB NVMe PCIe 4.0', 'SSD-WD-SN850X-1TB', 8, 5,
'Ổ cứng SSD NVMe WD Black SN850X 1TB PCIe 4.0. Được tối ưu cho gaming với hiệu năng cao.',
2990000, 2690000, 30,
'["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "1TB", "interface": "PCIe 4.0 x4 NVMe", "read_speed": "7300 MB/s", "write_speed": "6600 MB/s", "form_factor": "M.2 2280", "warranty": "5 years", "gaming_optimized": "Yes"}',
false, true),

('Crucial P5 Plus 500GB NVMe PCIe 4.0', 'SSD-CRUCIAL-P5PLUS-500GB', 9, 5,
'Ổ cứng SSD NVMe Crucial P5 Plus 500GB PCIe 4.0. Hiệu năng tốt với giá hợp lý.',
1490000, 1290000, 45,
'["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "500GB", "interface": "PCIe 4.0 x4 NVMe", "read_speed": "6600 MB/s", "write_speed": "5000 MB/s", "form_factor": "M.2 2280", "warranty": "5 years", "nand": "3D NAND"}',
false, true),

-- HDD
('Seagate BarraCuda 4TB SATA', 'HDD-SEAGATE-4TB', 10, 5,
'Ổ cứng HDD Seagate BarraCuda 4TB 7200RPM. Dung lượng lớn cho lưu trữ dữ liệu.',
2290000, 2090000, 25,
'["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"capacity": "4TB", "interface": "SATA 6Gb/s", "rpm": "7200", "cache": "256MB", "form_factor": "3.5 inch", "warranty": "2 years"}',
false, true),

-- =====================================
-- 5. MAINBOARD
-- =====================================

-- Intel Z790 Motherboards
('ASUS ROG Maximus Z790 Hero', 'MB-ASUS-Z790-HERO', 11, 3,
'Bo mạch chủ cao cấp ASUS ROG Maximus Z790 Hero cho CPU Intel thế hệ 12-14. Hỗ trợ DDR5, PCIe 5.0, WiFi 6E.',
12990000, 11990000, 8,
'["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"socket": "LGA1700", "chipset": "Z790", "memory": "DDR5-7800+", "memory_slots": "4", "pcie_slots": "4", "sata": "6", "m2_slots": "4", "wifi": "WiFi 6E", "bluetooth": "5.3", "usb": "USB 3.2 Gen 2x2", "form_factor": "ATX"}',
true, true),

('MSI MPG Z790 Gaming Plus WiFi', 'MB-MSI-Z790-GAMING', 12, 3,
'Bo mạch chủ MSI MPG Z790 Gaming Plus WiFi. Thiết kế gaming với RGB, hỗ trợ DDR5 và PCIe 5.0.',
6990000, 6490000, 15,
'["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"socket": "LGA1700", "chipset": "Z790", "memory": "DDR5-7200+", "memory_slots": "4", "pcie_slots": "3", "sata": "6", "m2_slots": "3", "wifi": "WiFi 6E", "bluetooth": "5.3", "rgb": "Mystic Light", "form_factor": "ATX"}',
false, true),

-- AMD X670E Motherboards
('ASUS ROG Strix X670E-E Gaming WiFi', 'MB-ASUS-X670E-STRIX', 11, 3,
'Bo mạch chủ cao cấp ASUS ROG Strix X670E-E Gaming cho CPU AMD Ryzen 7000. Hỗ trợ DDR5, PCIe 5.0.',
11990000, 10990000, 10,
'["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"socket": "AM5", "chipset": "X670E", "memory": "DDR5-6400+", "memory_slots": "4", "pcie_slots": "4", "sata": "8", "m2_slots": "4", "wifi": "WiFi 6E", "bluetooth": "5.2", "usb": "USB 4.0", "form_factor": "ATX"}',
true, true),

('MSI MPG X670E Gaming Plus WiFi', 'MB-MSI-X670E-GAMING', 12, 3,
'Bo mạch chủ MSI MPG X670E Gaming Plus WiFi cho AMD Ryzen 7000. Thiết kế gaming với RGB.',
8990000, 8290000, 12,
'["https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"socket": "AM5", "chipset": "X670E", "memory": "DDR5-6000+", "memory_slots": "4", "pcie_slots": "3", "sata": "6", "m2_slots": "4", "wifi": "WiFi 6E", "bluetooth": "5.3", "rgb": "Mystic Light", "form_factor": "ATX"}',
false, true),

-- =====================================
-- 6. MONITOR
-- =====================================

-- Gaming Monitors
('ASUS ROG Swift PG27AQN 27" 360Hz', 'MON-ASUS-PG27AQN', 11, 8,
'Màn hình gaming ASUS ROG Swift PG27AQN 27" QHD 360Hz. G-SYNC Ultimate, HDR600, thời gian phản hồi 1ms.',
24990000, 23490000, 5,
'["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"size": "27 inch", "resolution": "2560x1440", "refresh_rate": "360Hz", "response_time": "1ms", "panel": "Fast IPS", "hdr": "HDR600", "gsync": "G-SYNC Ultimate", "ports": "1x DisplayPort 1.4, 1x HDMI 2.0, 2x USB 3.0"}',
true, true),

('LG UltraGear 27GP950-B 27" 4K 160Hz', 'MON-LG-27GP950', 13, 8,
'Màn hình gaming LG UltraGear 27" 4K UHD 160Hz. Nano IPS, HDR600, G-SYNC Compatible.',
14990000, 13990000, 8,
'["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"size": "27 inch", "resolution": "3840x2160", "refresh_rate": "160Hz", "response_time": "1ms", "panel": "Nano IPS", "hdr": "HDR600", "gsync": "G-SYNC Compatible", "ports": "2x HDMI 2.1, 1x DisplayPort 1.4, 2x USB 3.0"}',
true, true),

('Samsung Odyssey G7 32" 240Hz Curved', 'MON-SAMSUNG-G7-32', 14, 8,
'Màn hình gaming Samsung Odyssey G7 32" QHD 240Hz cong 1000R. QLED, HDR600, G-SYNC Compatible.',
12990000, 11990000, 10,
'["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"size": "32 inch", "resolution": "2560x1440", "refresh_rate": "240Hz", "response_time": "1ms", "panel": "QLED VA", "curvature": "1000R", "hdr": "HDR600", "gsync": "G-SYNC Compatible", "ports": "1x DisplayPort 1.4, 2x HDMI 2.0, 2x USB 3.0"}',
false, true),

-- =====================================
-- 7. COOLING - AIO & AIR COOLER
-- =====================================

-- AIO Liquid Coolers
('Corsair iCUE H150i Elite Capellix 360mm', 'COOL-CORSAIR-H150I', 4, 6,
'Tản nhiệt nước AIO Corsair iCUE H150i Elite Capellix 360mm. RGB Capellix LEDs, hiệu năng tản nhiệt tuyệt vời.',
4990000, 4490000, 15,
'["https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "AIO Liquid Cooler", "radiator_size": "360mm", "fans": "3x 120mm ML120 RGB", "pump": "Capellix RGB", "tdp": "250W+", "sockets": "Intel: LGA1700, LGA1200, LGA115X | AMD: AM5, AM4", "warranty": "5 years"}',
true, true),

('NZXT Kraken X63 280mm RGB', 'COOL-NZXT-X63', 15, 6,
'Tản nhiệt nước AIO NZXT Kraken X63 280mm với màn hình LCD và RGB. Thiết kế đẹp mắt, hiệu năng cao.',
3990000, 3690000, 20,
'["https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "AIO Liquid Cooler", "radiator_size": "280mm", "fans": "2x 140mm Aer P", "pump": "LCD Display + RGB", "tdp": "200W+", "sockets": "Intel: LGA1700, LGA1200, LGA115X | AMD: AM5, AM4", "warranty": "6 years"}',
false, true),

-- Air Coolers
('Noctua NH-D15 Dual Tower', 'COOL-NOCTUA-NHD15', 16, 6,
'Tản nhiệt khí cao cấp Noctua NH-D15 với thiết kế dual tower. Hiệu năng tản nhiệt tuyệt vời, hoạt động êm ái.',
2290000, 2090000, 25,
'["https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Air Cooler", "design": "Dual Tower", "fans": "2x NF-A15 140mm", "height": "165mm", "tdp": "250W+", "sockets": "Intel: LGA1700, LGA1200, LGA115X | AMD: AM5, AM4", "warranty": "6 years"}',
false, true),

-- =====================================
-- 8. GAMING ACCESSORIES
-- =====================================

-- Gaming Keyboards
('Logitech G Pro X TKL Gaming Keyboard', 'KB-LOGITECH-PROX', 17, 9,
'Bàn phím cơ gaming Logitech G Pro X TKL với switch có thể thay đổi. Thiết kế tenkeyless, RGB LIGHTSYNC.',
2990000, 2690000, 30,
'["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Mechanical Gaming Keyboard", "layout": "Tenkeyless", "switches": "GX Blue/Brown/Red (Hot-swappable)", "backlight": "RGB LIGHTSYNC", "connection": "USB-C", "features": "Detachable cable, Tournament mode", "warranty": "2 years"}',
false, true),

('SteelSeries Apex Pro TKL', 'KB-STEELSERIES-APEX', 18, 9,
'Bàn phím cơ gaming SteelSeries Apex Pro TKL với OmniPoint switch có thể điều chỉnh. OLED Smart Display.',
4490000, 3990000, 20,
'["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Mechanical Gaming Keyboard", "layout": "Tenkeyless", "switches": "OmniPoint Adjustable", "backlight": "RGB Per-key", "display": "OLED Smart Display", "connection": "USB-C", "features": "Magnetic switches, Actuation 0.4-3.6mm", "warranty": "2 years"}',
true, true),

-- Gaming Mice
('Logitech G Pro X Superlight', 'MOUSE-LOGITECH-SUPERLIGHT', 17, 9,
'Chuột gaming không dây Logitech G Pro X Superlight chỉ 63g. Sensor HERO 25K, pin 70 giờ.',
2990000, 2690000, 35,
'["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Wireless Gaming Mouse", "weight": "63g", "sensor": "HERO 25K", "dpi": "25,600", "battery": "70 hours", "connection": "LIGHTSPEED Wireless", "buttons": "5", "warranty": "2 years"}',
true, true),

('Razer DeathAdder V3 Pro', 'MOUSE-RAZER-DA-V3PRO', 19, 9,
'Chuột gaming không dây Razer DeathAdder V3 Pro. Focus Pro 30K sensor, pin 90 giờ.',
3490000, 3190000, 25,
'["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Wireless Gaming Mouse", "weight": "88g", "sensor": "Focus Pro 30K", "dpi": "30,000", "battery": "90 hours", "connection": "HyperSpeed Wireless", "buttons": "8", "warranty": "2 years"}',
false, true),

-- Gaming Headsets
('SteelSeries Arctis 7P Wireless', 'HEADSET-STEELSERIES-7P', 18, 9,
'Tai nghe gaming không dây SteelSeries Arctis 7P. Âm thanh DTS Headphone:X 2.0, pin 24 giờ.',
3490000, 3190000, 20,
'["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Wireless Gaming Headset", "driver": "40mm", "frequency": "20Hz - 20KHz", "microphone": "ClearCast", "battery": "24 hours", "connection": "2.4GHz Wireless", "compatibility": "PC, PS5, PS4, Switch", "warranty": "2 years"}',
false, true),

('HyperX Cloud Alpha Wireless', 'HEADSET-HYPERX-ALPHA', 20, 9,
'Tai nghe gaming không dây HyperX Cloud Alpha với pin 300 giờ. DTS Headphone:X, micro có thể tháo rời.',
4490000, 3990000, 15,
'["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"]',
'{"type": "Wireless Gaming Headset", "driver": "50mm", "frequency": "15Hz - 21KHz", "microphone": "Detachable", "battery": "300 hours", "connection": "2.4GHz Wireless", "features": "DTS Headphone:X, Dual Chamber Drivers", "warranty": "2 years"}',
true, true);

-- =====================================
-- Kiểm tra kết quả
-- =====================================

SELECT 
    c.category_name,
    COUNT(p.product_id) as product_count,
    AVG(p.price) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
WHERE c.parent_id IS NULL
GROUP BY c.category_id, c.category_name
ORDER BY product_count DESC;

-- Hiển thị tổng quan
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_products,
    AVG(price) as average_price,
    SUM(stock_quantity) as total_stock
FROM products; 