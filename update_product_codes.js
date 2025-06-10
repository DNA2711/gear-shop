const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'gear_shop'
};

// Brand abbreviations mapping
const brandAbbreviations = {
    'Intel Corporation': 'INT',
    'Advanced Micro Devices': 'AMD',
    'NVIDIA Corporation': 'NVI',
    'ASUSTeK Computer Inc.': 'ASU',
    'Micro-Star International': 'MSI',
    'Gigabyte Technology': 'GIG',
    'Corsair Gaming': 'COR',
    'Samsung Electronics': 'SAM',
    'Kingston Technology': 'KIN',
    'Western Digital': 'WD',
    'Razer Inc.': 'RAZ',
    'Logitech International': 'LOG'
};

// Category type mapping
const categoryTypes = {
    'CPU': 'CPU',
    'VGA': 'VGA',
    'Mainboard': 'MOB',
    'RAM': 'RAM',
    'Storage': 'STO',
    'SSD': 'SSD',
    'HDD': 'HDD',
    'DDR4': 'D4',
    'DDR5': 'D5',
    'Cooling': 'COL',
    'Case': 'CAS',
    'Monitor': 'MON',
    'Gaming Monitor': 'GMO',
    'Office Monitor': 'OMO',
    'Accessories': 'ACC',
    'Keyboard': 'KEY',
    'Mouse': 'MOU',
    'Intel': 'CPU',
    'AMD': 'CPU',
    'NVIDIA': 'VGA',
    'AMD Radeon': 'VGA'
};

function generateProductCode(product, brand, category) {
    let code = '';

    // 1. Brand abbreviation (3 characters)
    const brandAbbr = brandAbbreviations[brand?.brand_name] || brand?.brand_name?.substring(0, 3).toUpperCase() || 'UNK';
    code += brandAbbr;

    // 2. Category type (3 characters)
    const categoryType = categoryTypes[category?.category_name] || category?.category_name?.substring(0, 3).toUpperCase() || 'GEN';
    code += categoryType;

    // 3. Extract model/specs from product name
    let modelPart = '';
    const productName = product.product_name.toUpperCase();

    // Extract key identifiers from product name
    if (productName.includes('I9')) modelPart += 'I9';
    else if (productName.includes('I7')) modelPart += 'I7';
    else if (productName.includes('I5')) modelPart += 'I5';
    else if (productName.includes('I3')) modelPart += 'I3';
    else if (productName.includes('RYZEN 9')) modelPart += 'R9';
    else if (productName.includes('RYZEN 7')) modelPart += 'R7';
    else if (productName.includes('RYZEN 5')) modelPart += 'R5';
    else if (productName.includes('RTX')) {
        const rtxMatch = productName.match(/RTX\s*(\d+)/);
        if (rtxMatch) modelPart += 'RTX' + rtxMatch[1];
    }
    else if (productName.includes('GTX')) {
        const gtxMatch = productName.match(/GTX\s*(\d+)/);
        if (gtxMatch) modelPart += 'GTX' + gtxMatch[1];
    }
    else if (productName.includes('RX')) {
        const rxMatch = productName.match(/RX\s*(\d+)/);
        if (rxMatch) modelPart += 'RX' + rxMatch[1];
    }

    // Extract memory size
    if (productName.includes('32GB')) modelPart += '32';
    else if (productName.includes('16GB')) modelPart += '16';
    else if (productName.includes('8GB')) modelPart += '8';
    else if (productName.includes('4GB')) modelPart += '4';

    // Extract storage size
    if (productName.includes('2TB')) modelPart += '2T';
    else if (productName.includes('1TB')) modelPart += '1T';
    else if (productName.includes('512GB')) modelPart += '512';
    else if (productName.includes('256GB')) modelPart += '256';

    // Add model part (limit to 6 characters to keep total under 15)
    if (modelPart.length > 6) modelPart = modelPart.substring(0, 6);
    code += modelPart;

    // 4. Internal SKU (2-3 digits)
    const sku = String(product.product_id).padStart(2, '0');
    code += sku;

    // Ensure code is under 15 characters
    if (code.length > 14) {
        code = code.substring(0, 14);
    }

    return code;
}

async function updateProductCodes() {
    let connection;

    try {
        // Create database connection
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Get all products with brand and category information
        const [products] = await connection.execute(`
      SELECT 
        p.product_id,
        p.product_name,
        p.product_code as old_code,
        b.brand_name,
        c.category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.product_id
    `);

        console.log(`Found ${products.length} products to update`);

        // Update each product
        for (const product of products) {
            const newCode = generateProductCode(
                product,
                { brand_name: product.brand_name },
                { category_name: product.category_name }
            );

            console.log(`Product ${product.product_id}: "${product.product_name}"`);
            console.log(`  Old code: ${product.old_code}`);
            console.log(`  New code: ${newCode}`);

            // Update the product code in database
            await connection.execute(
                'UPDATE products SET product_code = ? WHERE product_id = ?',
                [newCode, product.product_id]
            );

            console.log('  ✅ Updated\n');
        }

        console.log('All product codes updated successfully!');

    } catch (error) {
        console.error('Error updating product codes:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the update
updateProductCodes(); 