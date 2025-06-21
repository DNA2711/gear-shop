const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "gear_shop",
  charset: "utf8mb4",
};

// Sample products data based on Vietnamese market
const sampleProducts = [
  // Intel CPUs
  {
    category: 'intel-cpu',
    brand: 'Intel',
    products: [
      {
        name: 'Intel Core i9-14900K',
        price: 14500000,
        salePrice: 13999000,
        description: 'Bộ vi xử lý Intel Core i9-14900K thế hệ 14, 24 nhân 32 luồng, tốc độ base 3.2GHz, boost 6.0GHz. Socket LGA1700, hỗ trợ DDR5.',
        specifications: {
          'Socket': 'LGA1700',
          'Số nhân': '24 nhân (8P + 16E)',
          'Số luồng': '32 luồng',
          'Tốc độ base': '3.2 GHz',
          'Tốc độ boost': '6.0 GHz',
          'Bộ nhớ đệm': '36 MB',
          'TDP': '125W',
          'RAM hỗ trợ': 'DDR5-5600, DDR4-3200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/intel-core-i9-14900k_1_7e9c0b13da6548e6876b1a2b9ed26e72.jpg'
        ],
        stockQuantity: 25
      },
      {
        name: 'Intel Core i7-14700K',
        price: 11200000,
        salePrice: 10899000,
        description: 'Bộ vi xử lý Intel Core i7-14700K, 20 nhân 28 luồng, tốc độ base 3.4GHz, boost 5.6GHz. Hiệu năng mạnh mẽ cho gaming và workstation.',
        specifications: {
          'Socket': 'LGA1700',
          'Số nhân': '20 nhân (8P + 12E)',
          'Số luồng': '28 luồng',
          'Tốc độ base': '3.4 GHz',
          'Tốc độ boost': '5.6 GHz',
          'Bộ nhớ đệm': '33 MB',
          'TDP': '125W',
          'RAM hỗ trợ': 'DDR5-5600, DDR4-3200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/intel-core-i7-14700k_1_8e5d4f2b6a7c48e3876b1a2b9ed26e72.jpg'
        ],
        stockQuantity: 40
      },
      {
        name: 'Intel Core i5-14600K',
        price: 7800000,
        salePrice: 7499000,
        description: 'Intel Core i5-14600K với 14 nhân 20 luồng, tốc độ boost 5.3GHz. Lựa chọn tuyệt vời cho gaming với hiệu suất giá cả hợp lý.',
        specifications: {
          'Socket': 'LGA1700',
          'Số nhân': '14 nhân (6P + 8E)',
          'Số luồng': '20 luồng',
          'Tốc độ base': '3.5 GHz',
          'Tốc độ boost': '5.3 GHz',
          'Bộ nhớ đệm': '24 MB',
          'TDP': '125W',
          'RAM hỗ trợ': 'DDR5-5600, DDR4-3200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/intel-core-i5-14600k_1_9f6e5g3c7b8d49f4987c2b3c0fe37f83.jpg'
        ],
        stockQuantity: 55
      }
    ]
  },
  // AMD CPUs
  {
    category: 'amd-cpu',
    brand: 'AMD',
    products: [
      {
        name: 'AMD Ryzen 9 7950X',
        price: 13800000,
        salePrice: 13299000,
        description: 'AMD Ryzen 9 7950X với 16 nhân 32 luồng, kiến trúc Zen 4 tiên tiến. Tốc độ boost 5.7GHz, socket AM5, hỗ trợ DDR5.',
        specifications: {
          'Socket': 'AM5',
          'Số nhân': '16 nhân',
          'Số luồng': '32 luồng',
          'Tốc độ base': '4.5 GHz',
          'Tốc độ boost': '5.7 GHz',
          'Bộ nhớ đệm': '64 MB L3',
          'TDP': '170W',
          'Kiến trúc': 'Zen 4 (5nm)',
          'RAM hỗ trợ': 'DDR5-5200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/amd-ryzen-9-7950x_1_a0b1c2d3e4f5687h9i0j1k2l3m4n5o6p.jpg'
        ],
        stockQuantity: 30
      },
      {
        name: 'AMD Ryzen 7 7800X3D',
        price: 11500000,
        salePrice: 10999000,
        description: 'AMD Ryzen 7 7800X3D với công nghệ 3D V-Cache độc quyền. 8 nhân 16 luồng, hiệu năng gaming vượt trội.',
        specifications: {
          'Socket': 'AM5',
          'Số nhân': '8 nhân',
          'Số luồng': '16 luồng',
          'Tốc độ base': '4.2 GHz',
          'Tốc độ boost': '5.0 GHz',
          'Bộ nhớ đệm': '96 MB L3 (64MB + 32MB 3D)',
          'TDP': '120W',
          'Kiến trúc': 'Zen 4 (5nm)',
          'RAM hỗ trợ': 'DDR5-5200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/amd-ryzen-7-7800x3d_1_b1c2d3e4f5g6798i0j1k2l3m4n5o6p7q.jpg'
        ],
        stockQuantity: 35
      },
      {
        name: 'AMD Ryzen 5 7600X',
        price: 6800000,
        salePrice: 6399000,
        description: 'AMD Ryzen 5 7600X, 6 nhân 12 luồng với kiến trúc Zen 4. Tốc độ boost 5.3GHz, hiệu năng gaming tuyệt vời.',
        specifications: {
          'Socket': 'AM5',
          'Số nhân': '6 nhân',
          'Số luồng': '12 luồng',
          'Tốc độ base': '4.7 GHz',
          'Tốc độ boost': '5.3 GHz',
          'Bộ nhớ đệm': '32 MB L3',
          'TDP': '105W',
          'Kiến trúc': 'Zen 4 (5nm)',
          'RAM hỗ trợ': 'DDR5-5200'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/amd-ryzen-5-7600x_1_c2d3e4f5g6h7809j1k2l3m4n5o6p7q8r.jpg'
        ],
        stockQuantity: 60
      }
    ]
  },
  // NVIDIA VGA
  {
    category: 'nvidia-vga',
    brand: 'NVIDIA',
    products: [
      {
        name: 'MSI GeForce RTX 4090 Gaming X Trio 24GB',
        price: 45900000,
        salePrice: 44999000,
        description: 'Card đồ họa flagship MSI RTX 4090 Gaming X Trio với 24GB GDDR6X. Hiệu năng 4K gaming và content creation đỉnh cao.',
        specifications: {
          'GPU': 'NVIDIA GeForce RTX 4090',
          'Bộ nhớ': '24GB GDDR6X',
          'Độ rộng bus': '384-bit',
          'Tốc độ nhớ': '21000 MHz',
          'CUDA Cores': '16384',
          'RT Cores': '128 (3rd Gen)',
          'Tensor Cores': '512 (4th Gen)',
          'TDP': '450W',
          'Kết nối': '3x DisplayPort 1.4a, 1x HDMI 2.1'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/msi-rtx-4090-gaming-x-trio_1_d3e4f5g6h7i8910k2l3m4n5o6p7q8r9s.jpg'
        ],
        stockQuantity: 8
      },
      {
        name: 'ASUS ROG Strix RTX 4080 Super OC 16GB',
        price: 32500000,
        salePrice: 31999000,
        description: 'ASUS ROG Strix RTX 4080 Super với thiết kế tản nhiệt Triple-Fan. 16GB GDDR6X, hiệu năng 4K gaming mượt mà.',
        specifications: {
          'GPU': 'NVIDIA GeForce RTX 4080 Super',
          'Bộ nhớ': '16GB GDDR6X',
          'Độ rộng bus': '256-bit',
          'Tốc độ nhớ': '23000 MHz',
          'CUDA Cores': '10240',
          'RT Cores': '80 (3rd Gen)',
          'Tensor Cores': '320 (4th Gen)',
          'TDP': '320W',
          'Kết nối': '3x DisplayPort 1.4a, 2x HDMI 2.1'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/asus-rog-strix-rtx-4080-super_1_e4f5g6h7i8j9021l3m4n5o6p7q8r9s0t.jpg'
        ],
        stockQuantity: 15
      },
      {
        name: 'Gigabyte RTX 4070 Super Gaming OC 12GB',
        price: 18900000,
        salePrice: 18499000,
        description: 'Gigabyte RTX 4070 Super Gaming OC với 12GB GDDR6X. Lựa chọn tuyệt vời cho gaming 1440p với ray tracing.',
        specifications: {
          'GPU': 'NVIDIA GeForce RTX 4070 Super',
          'Bộ nhớ': '12GB GDDR6X',
          'Độ rộng bus': '192-bit',
          'Tốc độ nhớ': '21000 MHz',
          'CUDA Cores': '7168',
          'RT Cores': '56 (3rd Gen)',
          'Tensor Cores': '224 (4th Gen)',
          'TDP': '220W',
          'Kết nối': '2x DisplayPort 1.4a, 2x HDMI 2.1'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/gigabyte-rtx-4070-super-gaming-oc_1_f5g6h7i8j9k0132m4n5o6p7q8r9s0t1u.jpg'
        ],
        stockQuantity: 25
      }
    ]
  },
  // AMD VGA
  {
    category: 'amd-vga',
    brand: 'AMD',
    products: [
      {
        name: 'Sapphire RX 7900 XTX Nitro+ 24GB',
        price: 28500000,
        salePrice: 27999000,
        description: 'Sapphire RX 7900 XTX Nitro+ với 24GB GDDR6. Hiệu năng 4K gaming mạnh mẽ với kiến trúc RDNA 3.',
        specifications: {
          'GPU': 'AMD Radeon RX 7900 XTX',
          'Bộ nhớ': '24GB GDDR6',
          'Độ rộng bus': '384-bit',
          'Tốc độ nhớ': '20000 MHz',
          'Stream Processors': '6144',
          'RT Accelerators': '96',
          'Infinity Cache': '96 MB',
          'TDP': '355W',
          'Kết nối': '2x DisplayPort 2.1, 1x HDMI 2.1, 1x USB-C'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/sapphire-rx-7900-xtx-nitro_1_g6h7i8j9k0l1243n5o6p7q8r9s0t1u2v.jpg'
        ],
        stockQuantity: 12
      },
      {
        name: 'PowerColor RX 7900 GRE Red Devil 16GB',
        price: 18500000,
        salePrice: 17999000,
        description: 'PowerColor RX 7900 GRE Red Devil với 16GB GDDR6. Hiệu năng 1440p gaming xuất sắc với giá cả hợp lý.',
        specifications: {
          'GPU': 'AMD Radeon RX 7900 GRE',
          'Bộ nhớ': '16GB GDDR6',
          'Độ rộng bus': '256-bit',
          'Tốc độ nhớ': '18000 MHz',
          'Stream Processors': '5120',
          'RT Accelerators': '80',
          'Infinity Cache': '64 MB',
          'TDP': '260W',
          'Kết nối': '2x DisplayPort 2.1, 2x HDMI 2.1'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/powercolor-rx-7900-gre-red-devil_1_h7i8j9k0l1m2354o6p7q8r9s0t1u2v3w.jpg'
        ],
        stockQuantity: 18
      }
    ]
  },
  // DDR4 RAM
  {
    category: 'ddr4',
    brand: 'Various',
    products: [
      {
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3600',
        price: 3200000,
        salePrice: 2999000,
        description: 'Bộ nhớ DDR4 Corsair Vengeance LPX 32GB (2x16GB) tốc độ 3600MHz. Thiết kế tản nhiệt thấp, tương thích cao.',
        specifications: {
          'Dung lượng': '32GB (2x16GB)',
          'Loại': 'DDR4',
          'Tốc độ': '3600 MHz',
          'Latency': 'CL18',
          'Điện áp': '1.35V',
          'Thiết kế': 'Low Profile',
          'RGB': 'Không',
          'Tương thích': 'Intel & AMD'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/corsair-vengeance-lpx-32gb-ddr4_1_i8j9k0l1m2n3465p7q8r9s0t1u2v3w4x.jpg'
        ],
        stockQuantity: 40
      },
      {
        name: 'G.Skill Trident Z RGB 16GB (2x8GB) DDR4-3200',
        price: 1800000,
        salePrice: 1699000,
        description: 'G.Skill Trident Z RGB 16GB với hiệu ứng RGB đẹp mắt. Tốc độ 3200MHz, hiệu năng ổn định cho gaming.',
        specifications: {
          'Dung lượng': '16GB (2x8GB)',
          'Loại': 'DDR4',
          'Tốc độ': '3200 MHz',
          'Latency': 'CL16',
          'Điện áp': '1.35V',
          'RGB': 'Có (RGB)',
          'Tản nhiệt': 'Aluminum heatspreader',
          'Tương thích': 'Intel & AMD'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/gskill-trident-z-rgb-16gb-ddr4_1_j9k0l1m2n3o4576q8r9s0t1u2v3w4x5y.jpg'
        ],
        stockQuantity: 60
      }
    ]
  },
  // SSD
  {
    category: 'ssd',
    brand: 'Various',
    products: [
      {
        name: 'Samsung 980 PRO 2TB NVMe SSD',
        price: 4800000,
        salePrice: 4599000,
        description: 'Samsung 980 PRO 2TB với hiệu năng PCIe 4.0 đỉnh cao. Tốc độ đọc 7000MB/s, lý tưởng cho gaming và content creation.',
        specifications: {
          'Dung lượng': '2TB',
          'Giao diện': 'PCIe 4.0 x4 NVMe',
          'Kích thước': 'M.2 2280',
          'Tốc độ đọc': '7000 MB/s',
          'Tốc độ ghi': '6900 MB/s',
          'IOPS đọc': '1,000K',
          'IOPS ghi': '1,000K',
          'TBW': '1200 TB',
          'Bảo hành': '5 năm'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/samsung-980-pro-2tb_1_k0l1m2n3o4p5687r9s0t1u2v3w4x5y6z.jpg'
        ],
        stockQuantity: 35
      },
      {
        name: 'WD Black SN850X 1TB NVMe Gaming SSD',
        price: 2800000,
        salePrice: 2699000,
        description: 'WD Black SN850X 1TB được tối ưu hóa cho gaming. Tốc độ đọc 7300MB/s, tương thích với PlayStation 5.',
        specifications: {
          'Dung lượng': '1TB',
          'Giao diện': 'PCIe 4.0 x4 NVMe',
          'Kích thước': 'M.2 2280',
          'Tốc độ đọc': '7300 MB/s',
          'Tốc độ ghi': '6600 MB/s',
          'IOPS đọc': '1,200K',
          'IOPS ghi': '1,100K',
          'TBW': '600 TB',
          'Tương thích PS5': 'Có',
          'Bảo hành': '5 năm'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/wd-black-sn850x-1tb_1_l1m2n3o4p5q6798s0t1u2v3w4x5y6z7a.jpg'
        ],
        stockQuantity: 45
      },
      {
        name: 'Kingston NV2 500GB NVMe SSD',
        price: 1200000,
        salePrice: 1099000,
        description: 'Kingston NV2 500GB với giá cả phải chăng. Hiệu năng PCIe 4.0 tốt, lựa chọn kinh tế cho nâng cấp.',
        specifications: {
          'Dung lượng': '500GB',
          'Giao diện': 'PCIe 4.0 x4 NVMe',
          'Kích thước': 'M.2 2280',
          'Tốc độ đọc': '3500 MB/s',
          'Tốc độ ghi': '2100 MB/s',
          'TBW': '160 TB',
          'Công nghệ': '3D NAND',
          'Bảo hành': '3 năm'
        },
        images: [
          'https://product.hstatic.net/1000026716/product/kingston-nv2-500gb_1_m2n3o4p5q6r7809t1u2v3w4x5y6z7a8b.jpg'
        ],
        stockQuantity: 70
      }
    ]
  }
];

class ProductImporter {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('✅ Kết nối database thành công');
    } catch (error) {
      console.error('❌ Lỗi kết nối database:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Đã đóng kết nối database');
    }
  }

  async getCategoryId(categoryCode) {
    try {
      const [rows] = await this.connection.execute(
        'SELECT category_id FROM categories WHERE category_code = ?',
        [categoryCode]
      );
      return rows.length > 0 ? rows[0].category_id : null;
    } catch (error) {
      console.error('Lỗi lấy category ID:', error);
      return null;
    }
  }

  async getBrandId(brandName) {
    try {
      // Check if brand exists
      let [rows] = await this.connection.execute(
        'SELECT brand_id FROM brands WHERE brand_name = ?',
        [brandName]
      );
      
      if (rows.length > 0) {
        return rows[0].brand_id;
      }

      // Create new brand
      const [result] = await this.connection.execute(
        'INSERT INTO brands (brand_name, brand_code) VALUES (?, ?)',
        [brandName, brandName.toLowerCase().replace(/\s+/g, '-')]
      );
      
      console.log(`✅ Tạo brand mới: ${brandName}`);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi xử lý brand:', error);
      return null;
    }
  }

  generateProductCode(name, brand) {
    const cleaned = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    return `${brand.toLowerCase()}-${cleaned}-${Date.now()}`;
  }

  async saveProduct(productData, categoryId, brandId) {
    try {
      const productCode = this.generateProductCode(productData.name, productData.brand || 'unknown');
      
      // Check if product already exists
      const [existing] = await this.connection.execute(
        'SELECT product_id FROM products WHERE product_name = ? AND brand_id = ?',
        [productData.name, brandId]
      );
      
      if (existing.length > 0) {
        console.log(`⚠️ Sản phẩm đã tồn tại: ${productData.name}`);
        return false;
      }

      const [result] = await this.connection.execute(`
        INSERT INTO products (
          product_name, product_code, brand_id, category_id, 
          description, price, sale_price, stock_quantity,
          image_urls, specifications, is_featured, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        productData.name,
        productCode,
        brandId,
        categoryId,
        productData.description,
        productData.price,
        productData.salePrice || null,
        productData.stockQuantity,
        JSON.stringify(productData.images),
        JSON.stringify(productData.specifications),
        false,
        true
      ]);

      console.log(`✅ Đã thêm sản phẩm: ${productData.name} - ${productData.price.toLocaleString('vi-VN')}đ`);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi lưu sản phẩm:', error);
      return false;
    }
  }

  async importAllProducts() {
    console.log('🚀 Bắt đầu import sản phẩm mẫu...');
    
    let totalProducts = 0;
    let totalValue = 0;
    
    for (const categoryData of sampleProducts) {
      try {
        console.log(`\n📂 Xử lý category: ${categoryData.category}`);
        
        const categoryId = await this.getCategoryId(categoryData.category);
        if (!categoryId) {
          console.error(`❌ Không tìm thấy category: ${categoryData.category}`);
          continue;
        }

        const brandId = await this.getBrandId(categoryData.brand);
        if (!brandId) {
          console.error(`❌ Không thể tạo/tìm brand: ${categoryData.brand}`);
          continue;
        }

        let categoryCount = 0;
        for (const product of categoryData.products) {
          const success = await this.saveProduct(product, categoryId, brandId);
          if (success) {
            categoryCount++;
            totalValue += product.price;
          }
        }

        console.log(`✅ Đã thêm ${categoryCount}/${categoryData.products.length} sản phẩm cho category ${categoryData.category}`);
        totalProducts += categoryCount;
        
      } catch (error) {
        console.error(`❌ Lỗi xử lý category ${categoryData.category}:`, error);
      }
    }

    console.log(`\n🎉 Hoàn tất import!`);
    console.log(`📊 Tổng kết:`);
    console.log(`- Đã import ${sampleProducts.length} categories`);
    console.log(`- Đã thêm ${totalProducts} sản phẩm mới`);
    console.log(`- Tổng giá trị hàng hóa: ${totalValue.toLocaleString('vi-VN')}đ`);
    console.log(`- Giá trị trung bình: ${Math.round(totalValue/totalProducts).toLocaleString('vi-VN')}đ/sản phẩm`);
    
    return totalProducts;
  }
}

// Main execution
async function main() {
  const importer = new ProductImporter();
  
  try {
    await importer.connect();
    const totalAdded = await importer.importAllProducts();
    
    if (totalAdded > 0) {
      console.log(`\n🛍️ Hệ thống gear-shop đã được cập nhật với ${totalAdded} sản phẩm mới!`);
      console.log(`💡 Bạn có thể truy cập website để xem các sản phẩm đã được thêm`);
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error);
  } finally {
    await importer.disconnect();
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection tại:', promise, 'lý do:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run script
if (require.main === module) {
  main();
}

module.exports = ProductImporter; 