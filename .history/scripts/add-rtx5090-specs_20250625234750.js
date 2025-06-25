const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT || '29150'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qNAXrRYDXJEfGGcrGFNRTRlKKYLpXhKn',
  database: process.env.DB_NAME || 'railway',
  charset: 'utf8mb4',
};

async function addRTX5090Specs() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    const productId = 25; // RTX 5090 product
    
    // Delete existing specifications first
    console.log('Deleting existing specifications...');
    await connection.execute(
      'DELETE FROM product_specifications WHERE product_id = ?',
      [productId]
    );
    
    // RTX 5090 specifications from the image
    const specifications = [
      { name: 'GPU', value: 'NVIDIA® GeForce RTX™ 5090', order: 1 },
      { name: 'CUDA® Cores', value: '21760 Units', order: 2 },
      { name: 'Bộ nhớ', value: '32GB GDDR7, tốc độ 28 Gbps', order: 3 },
      { name: 'Giao diện', value: 'PCI Express® Gen 5', order: 4 },
      { name: 'Xung nhịp', value: 'Extreme Performance: 2497 MHz, Boost: 2482 MHz', order: 5 },
      { name: 'Bus bộ nhớ', value: '512-bit', order: 6 },
      { name: 'Cổng kết nối', value: 'DisplayPort x 3 (v2.1b), HDMI™ 2.1b x 1', order: 7 },
      { name: 'Hỗ trợ HDCP', value: 'Yes', order: 8 },
      { name: 'Tiêu thụ điện', value: '575 W', order: 9 },
      { name: 'Đầu cấp nguồn', value: '16-pin x 1', order: 10 },
      { name: 'PSU khuyến nghị', value: '1000 W', order: 11 },
      { name: 'Kích thước', value: '359 x 149 x 70 mm', order: 12 },
      { name: 'Trọng lượng', value: '2119 g (card) / 2735 g (gói)', order: 13 },
      { name: 'DirectX', value: '12 Ultimate', order: 14 },
      { name: 'OpenGL', value: '4.6', order: 15 },
      { name: 'Số màn hình tối đa', value: '4', order: 16 },
      { name: 'G-SYNC®', value: 'Có', order: 17 },
      { name: 'Độ phân giải tối đa', value: '7680 x 4320', order: 18 }
    ];
    
    console.log('Adding RTX 5090 specifications...');
    
    for (const spec of specifications) {
      await connection.execute(
        `INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [productId, spec.name, spec.value, spec.order]
      );
      console.log(`✓ Added: ${spec.name}`);
    }
    
    console.log(`\n🎉 Successfully added ${specifications.length} specifications to RTX 5090!`);
    
    // Verify the specs were added
    const [rows] = await connection.execute(
      'SELECT spec_name, spec_value FROM product_specifications WHERE product_id = ? ORDER BY display_order',
      [productId]
    );
    
    console.log('\n📋 Current specifications:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.spec_name}: ${row.spec_value}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
addRTX5090Specs(); 