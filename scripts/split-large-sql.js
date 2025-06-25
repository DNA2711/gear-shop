// Script to split large SQL file into smaller chunks
// Usage: node scripts/split-large-sql.js

const fs = require('fs');
const path = require('path');

const inputFile = 'backup/gearhub.sql';
const outputDir = 'backup/chunks';
const maxLinesPerFile = 1000; // 1000 dòng mỗi file

console.log('🔧 Splitting large SQL file...');

try {
    // Tạo thư mục output
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Đọc file SQL
    const sqlContent = fs.readFileSync(inputFile, 'utf8');
    const lines = sqlContent.split('\n');

    console.log(`📖 File có ${lines.length} dòng`);
    console.log(`📁 Sẽ chia thành ${Math.ceil(lines.length / maxLinesPerFile)} files`);

    let fileIndex = 1;
    let currentLines = [];

    // Thêm header cho mỗi file
    const header = `-- Split SQL file part ${fileIndex}
-- Generated: ${new Date().toISOString()}
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE railway;

`;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Bỏ qua dòng trống và comment
        if (line === '' || line.startsWith('--')) {
            continue;
        }

        currentLines.push(lines[i]);

        // Khi đủ số dòng hoặc hết file
        if (currentLines.length >= maxLinesPerFile || i === lines.length - 1) {
            const fileName = `part${fileIndex.toString().padStart(3, '0')}.sql`;
            const filePath = path.join(outputDir, fileName);

            // Thêm footer
            const footer = `
-- End of part ${fileIndex}
SET FOREIGN_KEY_CHECKS = 1;
`;

            const fileContent = header.replace(`part ${fileIndex}`, `part ${fileIndex}`) +
                currentLines.join('\n') +
                footer;

            fs.writeFileSync(filePath, fileContent);
            console.log(`✅ Created: ${fileName} (${currentLines.length} lines)`);

            fileIndex++;
            currentLines = [];
        }
    }

    console.log(`
🎉 Split completed!
📁 Files created in: ${outputDir}
📋 Import order:
`);

    // List all created files
    const files = fs.readdirSync(outputDir).sort();
    files.forEach((file, index) => {
        console.log(`${index + 1}. railway connect mysql → source ${outputDir}/${file};`);
    });

} catch (error) {
    console.error('❌ Error:', error.message);
} 