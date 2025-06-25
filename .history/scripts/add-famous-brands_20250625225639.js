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
  { brand_name: 'Intel', website: 'https://www.intel.com' },
  { brand_name: 'AMD', website: 'https://www.amd.com' },
  
  // GPU/VGA
  { brand_name: 'NVIDIA', website: 'https://www.nvidia.com' },
  { brand_name: 'MSI', website: 'https://www.msi.com' },
  { brand_name: 'ASUS', website: 'https://www.asus.com' },
  { brand_name: 'Gigabyte', website: 'https://www.gigabyte.com' },
  { brand_name: 'EVGA', website: 'https://www.evga.com' },
  { brand_name: 'Zotac', website: 'https://www.zotac.com' },
  { brand_name: 'Palit', website: 'https://www.palit.com' },
  
  // RAM
  { brand_name: 'Corsair', website: 'https://www.corsair.com' },
  { brand_name: 'G.Skill', website: 'https://www.gskill.com' },
  { brand_name: 'Kingston', website: 'https://www.kingston.com' },
  { brand_name: 'Crucial', website: 'https://www.crucial.com' },
  { brand_name: 'Team Group', website: 'https://www.teamgroupinc.com' },
  
  // Storage (SSD/HDD)
  { brand_name: 'Samsung', website: 'https://www.samsung.com' },
  { brand_name: 'Western Digital', website: 'https://www.westerndigital.com' },
  { brand_name: 'Seagate', website: 'https://www.seagate.com' },
  { brand_name: 'SanDisk', website: 'https://www.sandisk.com' },
  
  // PSU (Power Supply)
  { brand_name: 'Seasonic', website: 'https://seasonic.com' },
  { brand_name: 'Cooler Master', website: 'https://www.coolermaster.com' },
  { brand_name: 'Thermaltake', website: 'https://www.thermaltake.com' },
  { brand_name: 'be quiet!', website: 'https://www.bequiet.com' },
  
  // Motherboard
  { brand_name: 'ASRock', website: 'https://www.asrock.com' },
  
  // Cooling
  { brand_name: 'Noctua', website: 'https://noctua.at' },
  { brand_name: 'Arctic', website: 'https://www.arctic.de' },
  { brand_name: 'NZXT', website: 'https://www.nzxt.com' },
  { brand_name: 'Deepcool', website: 'https://www.deepcool.com' },
  
  // Case
  { brand_name: 'Fractal Design', website: 'https://www.fractal-design.com' },
  { brand_name: 'Lian Li', website: 'https://lian-li.com' },
  { brand_name: 'Phanteks', website: 'https://phanteks.com' },
  
  // Monitor
  { brand_name: 'LG', website: 'https://www.lg.com' },
  { brand_name: 'Dell', website: 'https://www.dell.com' },
  { brand_name: 'Acer', website: 'https://www.acer.com' },
  { brand_name: 'BenQ', website: 'https://www.benq.com' },
  { brand_name: 'ViewSonic', website: 'https://www.viewsonic.com' },
  
  // Networking
  { brand_name: 'TP-Link', website: 'https://www.tp-link.com' },
  { brand_name: 'Netgear', website: 'https://www.netgear.com' },
  { brand_name: 'D-Link', website: 'https://www.dlink.com' },
  
  // Gaming Peripherals
  { brand_name: 'Logitech', website: 'https://www.logitech.com' },
  { brand_name: 'Razer', website: 'https://www.razer.com' },
  { brand_name: 'SteelSeries', website: 'https://steelseries.com' },
  { brand_name: 'HyperX', website: 'https://www.hyperxgaming.com' }
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