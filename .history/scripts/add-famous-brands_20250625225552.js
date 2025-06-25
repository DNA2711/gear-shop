const mysql = require('mysql2/promise');

// Cấu hình kết nối Railway database
const dbConfig = {
    host: 'caboose.proxy.rlwy.net',
    port: 29150,
    user: 'root',
    password: 'RTbPDjFprveDAFWcKaIjOpiFimetgWdR',
    database: 'railway',
    charset: 'utf8mb4'
};

// Danh sách các thương hiệu nổi tiếng về linh kiện máy tính
const famousBrands = [
    // CPU
    { brand_name: 'Intel', brand_code: 'INTEL', description: 'Nhà sản xuất vi xử lý hàng đầu thế giới' },
    { brand_name: 'AMD', brand_code: 'AMD', description: 'Nhà sản xuất vi xử lý và card đồ họa' },

    // GPU/VGA
    { brand_name: 'NVIDIA', brand_code: 'NVIDIA', description: 'Nhà sản xuất card đồ họa hàng đầu' },
    { brand_name: 'MSI', brand_code: 'MSI', description: 'Thương hiệu nổi tiếng về card đồ họa và mainboard' },
    { brand_name: 'ASUS', brand_code: 'ASUS', description: 'Thương hiệu đa dạng về linh kiện máy tính' },
    { brand_name: 'Gigabyte', brand_code: 'GIGABYTE', description: 'Chuyên về mainboard và card đồ họa' },
    { brand_name: 'EVGA', brand_code: 'EVGA', description: 'Chuyên về card đồ họa NVIDIA' },
    { brand_name: 'Zotac', brand_code: 'ZOTAC', description: 'Nhà sản xuất card đồ họa compact' },
    { brand_name: 'Palit', brand_code: 'PALIT', description: 'Thương hiệu card đồ họa giá tốt' },

    // RAM
    { brand_name: 'Corsair', brand_code: 'CORSAIR', description: 'Thương hiệu gaming gear và linh kiện cao cấp' },
    { brand_name: 'G.Skill', brand_code: 'GSKILL', description: 'Chuyên về RAM hiệu năng cao' },
    { brand_name: 'Kingston', brand_code: 'KINGSTON', description: 'Thương hiệu bộ nhớ và lưu trữ uy tín' },
    { brand_name: 'Crucial', brand_code: 'CRUCIAL', description: 'Thương hiệu RAM và SSD của Micron' },
    { brand_name: 'Team Group', brand_code: 'TEAMGROUP', description: 'Nhà sản xuất RAM và SSD' },

    // Storage (SSD/HDD)
    { brand_name: 'Samsung', brand_code: 'SAMSUNG', description: 'Thương hiệu hàng đầu về SSD và công nghệ' },
    { brand_name: 'Western Digital', brand_code: 'WD', description: 'Chuyên về ổ cứng và thiết bị lưu trữ' },
    { brand_name: 'Seagate', brand_code: 'SEAGATE', description: 'Nhà sản xuất ổ cứng lớn nhất thế giới' },
    { brand_name: 'SanDisk', brand_code: 'SANDISK', description: 'Chuyên về SSD và thẻ nhớ' },
    { brand_name: 'Intel SSD', brand_code: 'INTEL_SSD', description: 'Dòng SSD của Intel' },

    // PSU (Power Supply)
    { brand_name: 'Seasonic', brand_code: 'SEASONIC', description: 'Nhà sản xuất nguồn chất lượng cao' },
    { brand_name: 'EVGA PSU', brand_code: 'EVGA_PSU', description: 'Dòng nguồn của EVGA' },
    { brand_name: 'Cooler Master', brand_code: 'COOLERMASTER', description: 'Thương hiệu về tản nhiệt và nguồn' },
    { brand_name: 'Thermaltake', brand_code: 'THERMALTAKE', description: 'Chuyên về case, nguồn và tản nhiệt' },
    { brand_name: 'be quiet!', brand_code: 'BEQUIET', description: 'Thương hiệu Đức chuyên về sản phẩm im lặng' },

    // Motherboard
    { brand_name: 'ASRock', brand_code: 'ASROCK', description: 'Nhà sản xuất mainboard uy tín' },
    { brand_name: 'ASUS ROG', brand_code: 'ASUS_ROG', description: 'Dòng gaming cao cấp của ASUS' },
    { brand_name: 'MSI Gaming', brand_code: 'MSI_GAMING', description: 'Dòng gaming của MSI' },

    // Cooling
    { brand_name: 'Noctua', brand_code: 'NOCTUA', description: 'Thương hiệu tản nhiệt hàng đầu' },
    { brand_name: 'Arctic', brand_code: 'ARCTIC', description: 'Nhà sản xuất tản nhiệt giá rẻ chất lượng' },
    { brand_name: 'NZXT', brand_code: 'NZXT', description: 'Thương hiệu gaming về case và tản nhiệt' },
    { brand_name: 'Deepcool', brand_code: 'DEEPCOOL', description: 'Thương hiệu tản nhiệt phổ biến' },

    // Case
    { brand_name: 'Fractal Design', brand_code: 'FRACTAL', description: 'Thương hiệu case thiết kế đẹp' },
    { brand_name: 'Lian Li', brand_code: 'LIANLI', description: 'Nhà sản xuất case aluminum cao cấp' },
    { brand_name: 'Phanteks', brand_code: 'PHANTEKS', description: 'Thương hiệu case và tản nhiệt' },

    // Monitor
    { brand_name: 'LG', brand_code: 'LG', description: 'Thương hiệu màn hình và điện tử' },
    { brand_name: 'Dell', brand_code: 'DELL', description: 'Thương hiệu máy tính và màn hình' },
    { brand_name: 'Acer', brand_code: 'ACER', description: 'Nhà sản xuất laptop và màn hình' },
    { brand_name: 'BenQ', brand_code: 'BENQ', description: 'Chuyên về màn hình gaming và văn phòng' },
    { brand_name: 'ViewSonic', brand_code: 'VIEWSONIC', description: 'Thương hiệu màn hình chuyên nghiệp' },

    // Networking
    { brand_name: 'TP-Link', brand_code: 'TPLINK', description: 'Thương hiệu thiết bị mạng phổ biến' },
    { brand_name: 'Asus Networking', brand_code: 'ASUS_NET', description: 'Dòng thiết bị mạng của ASUS' },
    { brand_name: 'Netgear', brand_code: 'NETGEAR', description: 'Nhà sản xuất thiết bị mạng cao cấp' },
    { brand_name: 'D-Link', brand_code: 'DLINK', description: 'Thương hiệu thiết bị mạng uy tín' },

    // Gaming Peripherals
    { brand_name: 'Logitech', brand_code: 'LOGITECH', description: 'Thương hiệu gaming gear và thiết bị ngoại vi' },
    { brand_name: 'Razer', brand_code: 'RAZER', description: 'Thương hiệu gaming gear hàng đầu' },
    { brand_name: 'SteelSeries', brand_code: 'STEELSERIES', description: 'Chuyên về gaming peripherals' },
    { brand_name: 'HyperX', brand_code: 'HYPERX', description: 'Thương hiệu gaming của Kingston' },
    { brand_name: 'Corsair Gaming', brand_code: 'CORSAIR_GAMING', description: 'Dòng gaming gear của Corsair' }
];

async function addFamousBrands() {
    let connection;

    try {
        console.log('Connecting to Railway database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Connected successfully!');
        console.log(`Adding ${famousBrands.length} famous brands...\n`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const brand of famousBrands) {
            try {
                        // Kiểm tra xem brand đã tồn tại chưa
        const [existing] = await connection.execute(
          'SELECT brand_id FROM brands WHERE brand_name = ?',
          [brand.brand_name]
        );

                if (existing.length > 0) {
                    console.log(`⏭️  Skipped: ${brand.brand_name} (already exists)`);
                    skippedCount++;
                    continue;
                }

                // Thêm brand mới (chỉ sử dụng brand_name vì bảng chỉ có cột này)
                const [result] = await connection.execute(
                    `INSERT INTO brands (brand_name, website) 
           VALUES (?, ?)`,
                    [brand.brand_name, brand.website || '']
                );

                console.log(`✅ Added: ${brand.brand_name} (ID: ${result.insertId})`);
                addedCount++;

            } catch (error) {
                console.log(`❌ Error adding ${brand.brand_name}:`, error.message);
            }
        }

        console.log(`\n🎉 Summary:`);
        console.log(`✅ Added: ${addedCount} brands`);
        console.log(`⏭️  Skipped: ${skippedCount} brands`);
        console.log(`📊 Total processed: ${addedCount + skippedCount} brands`);

        // Hiển thị tổng số brands trong database
        const [totalCount] = await connection.execute('SELECT COUNT(*) as total FROM brands');
        console.log(`🗃️  Total brands in database: ${totalCount[0].total}`);

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

// Chạy script
addFamousBrands().catch(console.error); 