const mysql = require('mysql2/promise');

async function checkOrdersTable() {
  const connection = await mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    port: 16648,
    user: 'root',
    password: '8XhNSKxZqIJVjwPgE7YlsaZGLq4Ccdl6',
    database: 'railway'
  });

  try {
    console.log('Checking orders table structure...');
    
    // Describe orders table
    const [rows] = await connection.execute('DESCRIBE orders');
    console.log('\nOrders table columns:');
    console.table(rows);
    
    // Sample data
    const [sampleData] = await connection.execute('SELECT * FROM orders LIMIT 2');
    console.log('\nSample orders data:');
    console.table(sampleData);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkOrdersTable(); 