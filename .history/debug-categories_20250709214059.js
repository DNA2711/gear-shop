const mysql = require('mysql2/promise');

async function debugCategories() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'gear_shop',
    });

    try {
        console.log('=== DEBUG CATEGORIES ===');

        const [categories] = await connection.execute('SELECT * FROM categories WHERE is_active = 1 ORDER BY category_id');
        console.log(`\nFound ${categories.length} active categories:`);
        categories.forEach(cat => {
            console.log(`- ID: ${cat.category_id}, Name: ${cat.category_name}, Code: ${cat.category_code}`);
        });

        console.log('\n=== DEBUG PRODUCTS ===');

        const [allProducts] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
        console.log(`\nTotal active products: ${allProducts[0].total}`);

        if (categories.length > 0) {
            const firstCategoryId = categories[0].category_id;
            console.log(`\nTesting category filter with category_id = ${firstCategoryId}:`);

            const [categoryProducts] = await connection.execute(
                'SELECT COUNT(*) as total FROM products WHERE category_id = ? AND is_active = 1',
                [firstCategoryId]
            );
            console.log(`Products in category ${firstCategoryId}: ${categoryProducts[0].total}`);

            const [sampleProducts] = await connection.execute(
                'SELECT product_id, product_name, category_id FROM products WHERE category_id = ? AND is_active = 1 LIMIT 5',
                [firstCategoryId]
            );
            console.log('Sample products:');
            sampleProducts.forEach(product => {
                console.log(`- ${product.product_name} (ID: ${product.product_id}, Category: ${product.category_id})`);
            });
        }

        console.log('\n=== PRODUCTS BY CATEGORY ===');
        const [productsByCategory] = await connection.execute(`
      SELECT 
        COALESCE(p.category_id, 0) as category_id,
        COALESCE(c.category_name, 'No Category') as category_name,
        COUNT(*) as product_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_active = 1
      GROUP BY p.category_id, c.category_name
      ORDER BY product_count DESC
    `);

        console.log('Products distribution by category:');
        productsByCategory.forEach(row => {
            console.log(`- Category ${row.category_id} (${row.category_name}): ${row.product_count} products`);
        });

    } catch (error) {
        console.error('Database error:', error);
    } finally {
        await connection.end();
    }
}

debugCategories(); 