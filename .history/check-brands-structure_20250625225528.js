const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'caboose.proxy.rlwy.net',
    port: 29150,
    user: 'root',
    password: 'RTbPDjFprveDAFWcKaIjOpiFimetgWdR',
    database: 'railway',
    charset: 'utf8mb4'
};

async function checkBrandsStructure() {
    let connection;

    try {
        console.log('Connecting to Railway database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Connected successfully!\n');

        // Check brands table structure
        console.log('📋 Brands table structure:');
        const [columns] = await connection.execute('DESCRIBE brands');
        console.table(columns);

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

checkBrandsStructure().catch(console.error); 