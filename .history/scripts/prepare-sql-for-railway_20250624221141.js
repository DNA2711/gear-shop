// Script to prepare exported SQL file for Railway import
// Usage: node scripts/prepare-sql-for-railway.js

const fs = require('fs');
const path = require('path');

const inputFile = 'backup/gear_shop_full_backup.sql';
const outputFile = 'backup/gear_shop_railway_ready.sql';

console.log('🔧 Preparing SQL file for Railway import...');

try {
  // Read the original SQL file
  let sqlContent = fs.readFileSync(inputFile, 'utf8');
  
  console.log(`📖 Read ${inputFile} (${sqlContent.length} characters)`);
  
  // Modifications for Railway compatibility
  const modifications = [
    // Replace database name
    {
      description: 'Replace database name with railway',
      from: /CREATE DATABASE.*?`gear_shop`/gi,
      to: '-- Database already exists on Railway'
    },
    {
      description: 'Replace USE gear_shop with USE railway',
      from: /USE\s+`?gear_shop`?/gi,
      to: 'USE `railway`'
    },
    
    // Handle charset and collation
    {
      description: 'Ensure utf8mb4 charset',
      from: /DEFAULT CHARSET=utf8[^4]/gi,
      to: 'DEFAULT CHARSET=utf8mb4'
    },
    
    // Handle AUTO_INCREMENT resets
    {
      description: 'Reset AUTO_INCREMENT values',
      from: /AUTO_INCREMENT=\d+/gi,
      to: 'AUTO_INCREMENT=1'
    },
    
    // Add SET commands for Railway compatibility
    {
      description: 'Add Railway compatibility settings',
      from: /^/,
      to: `-- Railway MySQL Import Script
-- Generated: ${new Date().toISOString()}

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET GROUP_CONCAT_MAX_LEN = 32768;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

USE \`railway\`;

`
    }
  ];
  
  // Apply modifications
  modifications.forEach(mod => {
    console.log(`🔄 ${mod.description}`);
    sqlContent = sqlContent.replace(mod.from, mod.to);
  });
  
  // Add final commands
  sqlContent += `

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Success message
SELECT 'Import completed successfully!' as message;
`;
  
  // Write the modified file
  fs.writeFileSync(outputFile, sqlContent);
  
  console.log(`✅ Railway-ready SQL file created: ${outputFile}`);
  console.log(`📊 File size: ${Math.round(fs.statSync(outputFile).size / 1024)} KB`);
  
  console.log(`
🚀 Next steps:
1. Open Railway MySQL Query editor
2. Copy content from: ${outputFile}
3. Paste and execute in Railway
4. Or use: mysql -h HOST -P PORT -u USER -pPASSWORD railway < ${outputFile}
`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(`
💡 Make sure:
1. Input file exists: ${inputFile}
2. Backup directory exists
3. You have read/write permissions
`);
} 