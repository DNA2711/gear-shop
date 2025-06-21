@echo off
chcp 65001 >nul

REM HACOM Product Import Script for Windows
REM Sử dụng: run-hacom-import.bat [số_sản_phẩm_mỗi_category]

echo 🚀 HACOM Product Import Tool
echo ================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm chưa được cài đặt. Vui lòng cài đặt npm trước.
    pause
    exit /b 1
)

REM Set default number of products per category
if "%1"=="" (
    set MAX_PRODUCTS=10
) else (
    set MAX_PRODUCTS=%1
)

echo 📝 Sẽ lấy tối đa %MAX_PRODUCTS% sản phẩm cho mỗi category

REM Install dependencies if needed
echo 🔍 Kiểm tra và cài đặt dependencies...
call npm install

REM Set environment variables if not set
if "%DB_HOST%"=="" set DB_HOST=localhost
if "%DB_PORT%"=="" set DB_PORT=3306
if "%DB_USER%"=="" set DB_USER=root
if "%DB_PASSWORD%"=="" set DB_PASSWORD=123456
if "%DB_NAME%"=="" set DB_NAME=gear_shop

echo 🏁 Bắt đầu import sản phẩm từ HACOM...
echo Database: %DB_HOST%:%DB_PORT%/%DB_NAME%
echo User: %DB_USER%

REM Run the import script
node scripts\import-hacom-products.js %MAX_PRODUCTS%

echo ✅ Hoàn tất import process!
pause 