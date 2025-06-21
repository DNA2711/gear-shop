#!/bin/bash

# HACOM Product Import Script
# Sử dụng: ./run-hacom-import.sh [số_sản_phẩm_mỗi_category]

echo "🚀 HACOM Product Import Tool"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt. Vui lòng cài đặt npm trước."
    exit 1
fi

# Set default number of products per category
MAX_PRODUCTS=${1:-10}

echo "📝 Sẽ lấy tối đa $MAX_PRODUCTS sản phẩm cho mỗi category"

# Install dependencies if needed
echo "🔍 Kiểm tra và cài đặt dependencies..."
npm install

# Set environment variables if not set
export DB_HOST=${DB_HOST:-"localhost"}
export DB_PORT=${DB_PORT:-"3306"}
export DB_USER=${DB_USER:-"root"}
export DB_PASSWORD=${DB_PASSWORD:-"123456"}
export DB_NAME=${DB_NAME:-"gear_shop"}

echo "🏁 Bắt đầu import sản phẩm từ HACOM..."
echo "Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "User: $DB_USER"

# Run the import script
node scripts/import-hacom-products.js $MAX_PRODUCTS

echo "✅ Hoàn tất import process!" 