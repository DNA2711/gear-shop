const mysql = require('mysql2/promise');
const axios = require('axios');
const cheerio = require('cheerio');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "gear_shop",
  charset: "utf8mb4",
};

// HACOM product categories to crawl
const hacomCategories = [
  {
    name: 'CPU Intel',
    url: 'https://hacom.vn/cpu-bo-vi-xu-ly',
    categoryCode: 'intel-cpu',
    brand: 'Intel'
  },
  {
    name: 'CPU AMD',
    url: 'https://hacom.vn/cpu-bo-vi-xu-ly',
    categoryCode: 'amd-cpu', 
    brand: 'AMD'
  },
  {
    name: 'VGA NVIDIA',
    url: 'https://hacom.vn/vga-card-man-hinh',
    categoryCode: 'nvidia-geforce',
    brand: 'NVIDIA'
  },
  {
    name: 'VGA AMD',
    url: 'https://hacom.vn/vga-card-man-hinh',
    categoryCode: 'amd-radeon',
    brand: 'AMD'
  },
  {
    name: 'RAM',
    url: 'https://hacom.vn/ram-bo-nho-trong',
    categoryCode: 'ddr4-ram',
    brand: 'Various'
  },
  {
    name: 'SSD',
    url: 'https://hacom.vn/o-cung-ssd',
    categoryCode: 'ssd-nvme',
    brand: 'Various'
  }
];

class HacomScraper {
  constructor() {
    this.connection = null;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
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

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get category ID by category code
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

  // Get or create brand ID
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
        'INSERT INTO brands (brand_name, brand_code, is_active) VALUES (?, ?, ?)',
        [brandName, brandName.toLowerCase().replace(/\s+/g, '-'), true]
      );
      
      console.log(`✅ Tạo brand mới: ${brandName}`);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi xử lý brand:', error);
      return null;
    }
  }

  // Extract product info from HACOM product page
  async scrapeProductDetails(productUrl) {
    try {
      await this.delay(1000); // Rate limiting
      
      const response = await axios.get(productUrl, { 
        headers: this.headers,
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      const product = {
        name: $('.product-name, .product-title, h1').first().text().trim(),
        price: this.extractPrice($('.product-price, .price-current, .price').first().text()),
        salePrice: this.extractPrice($('.price-sale, .price-old, .price-original').first().text()),
        description: $('.product-description, .product-content').first().text().trim(),
        images: this.extractImages($, productUrl),
        specifications: this.extractSpecs($),
        stockQuantity: this.extractStock($('.stock, .quantity, .available').first().text())
      };

      return product;
    } catch (error) {
      console.error(`Lỗi scrape sản phẩm ${productUrl}:`, error.message);
      return null;
    }
  }

  extractPrice(priceText) {
    if (!priceText) return 0;
    const cleaned = priceText.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned) : 0;
  }

  extractImages($, baseUrl) {
    const images = [];
    $('.product-image img, .product-gallery img').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href;
        images.push(fullUrl);
      }
    });
    return images.slice(0, 5); // Limit to 5 images
  }

  extractSpecs($) {
    const specs = {};
    $('.spec-table tr, .specification tr, .product-specs tr').each((i, elem) => {
      const key = $(elem).find('td:first-child, th').text().trim();
      const value = $(elem).find('td:last-child').text().trim();
      if (key && value) {
        specs[key] = value;
      }
    });
    return specs;
  }

  extractStock(stockText) {
    if (!stockText) return 10; // Default stock
    const match = stockText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 10;
  }

  // Generate product code
  generateProductCode(name, brand) {
    const cleaned = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    return `${brand.toLowerCase()}-${cleaned}-${Date.now()}`;
  }

  // Save product to database
  async saveProduct(productData, categoryId, brandId) {
    try {
      const productCode = this.generateProductCode(productData.name, productData.brand || 'unknown');
      
      // Check if product already exists
      const [existing] = await this.connection.execute(
        'SELECT product_id FROM products WHERE product_code = ?',
        [productCode]
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

      console.log(`✅ Đã thêm sản phẩm: ${productData.name}`);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi lưu sản phẩm:', error);
      return false;
    }
  }

  // Scrape products from a category page
  async scrapeCategory(category, maxProducts = 20) {
    try {
      console.log(`\n🔍 Đang crawl category: ${category.name}`);
      
      const response = await axios.get(category.url, { 
        headers: this.headers,
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      
      // Find product links
      const productLinks = [];
      $('.product-item a, .item-product a, .product-link').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && productLinks.length < maxProducts) {
          const fullUrl = href.startsWith('http') ? href : `https://hacom.vn${href}`;
          productLinks.push(fullUrl);
        }
      });

      console.log(`📦 Tìm thấy ${productLinks.length} sản phẩm trong category ${category.name}`);

      const categoryId = await this.getCategoryId(category.categoryCode);
      if (!categoryId) {
        console.error(`❌ Không tìm thấy category: ${category.categoryCode}`);
        return 0;
      }

      const brandId = await this.getBrandId(category.brand);
      if (!brandId) {
        console.error(`❌ Không thể tạo/tìm brand: ${category.brand}`);
        return 0;
      }

      let successCount = 0;
      
      for (const link of productLinks.slice(0, maxProducts)) {
        try {
          const productData = await this.scrapeProductDetails(link);
          if (productData && productData.name && productData.price > 0) {
            productData.brand = category.brand;
            const success = await this.saveProduct(productData, categoryId, brandId);
            if (success) successCount++;
          }
          
          // Rate limiting
          await this.delay(2000);
        } catch (error) {
          console.error(`❌ Lỗi xử lý sản phẩm: ${error.message}`);
        }
      }

      console.log(`✅ Đã thêm ${successCount}/${productLinks.length} sản phẩm cho category ${category.name}`);
      return successCount;
      
    } catch (error) {
      console.error(`❌ Lỗi crawl category ${category.name}:`, error.message);
      return 0;
    }
  }

  // Main function to scrape all categories
  async scrapeAllCategories(maxProductsPerCategory = 10) {
    console.log('🚀 Bắt đầu crawl sản phẩm từ HACOM...');
    
    let totalProducts = 0;
    
    for (const category of hacomCategories) {
      try {
        const count = await this.scrapeCategory(category, maxProductsPerCategory);
        totalProducts += count;
        
        // Delay between categories
        await this.delay(3000);
      } catch (error) {
        console.error(`❌ Lỗi xử lý category ${category.name}:`, error);
      }
    }

    console.log(`\n🎉 Hoàn tất! Đã thêm tổng cộng ${totalProducts} sản phẩm từ HACOM`);
    return totalProducts;
  }
}

// Main execution
async function main() {
  const scraper = new HacomScraper();
  
  try {
    await scraper.connect();
    
    // Get max products per category from command line args or default to 10
    const maxProducts = parseInt(process.argv[2]) || 10;
    console.log(`📝 Sẽ lấy tối đa ${maxProducts} sản phẩm cho mỗi category`);
    
    const totalAdded = await scraper.scrapeAllCategories(maxProducts);
    
    console.log(`\n📊 Tổng kết:`);
    console.log(`- Đã crawl ${hacomCategories.length} categories`);
    console.log(`- Đã thêm ${totalAdded} sản phẩm mới`);
    console.log(`- Rate limit: 2 giây giữa các sản phẩm, 3 giây giữa các category`);
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error);
  } finally {
    await scraper.disconnect();
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

module.exports = HacomScraper; 