param(
    [int]$MaxProducts = 10,
    [string]$DBHost = "localhost",
    [int]$DBPort = 3306,
    [string]$DBUser = "root",
    [string]$DBPassword = "123456",
    [string]$DBName = "gear_shop"
)

# HACOM Product Import Script for PowerShell
Write-Host "🚀 HACOM Product Import Tool" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detected: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm chưa được cài đặt. Vui lòng cài đặt npm trước." -ForegroundColor Red
    exit 1
}

Write-Host "📝 Sẽ lấy tối đa $MaxProducts sản phẩm cho mỗi category" -ForegroundColor Yellow

# Install dependencies if needed
Write-Host "🔍 Kiểm tra và cài đặt dependencies..." -ForegroundColor Blue
npm install

# Set environment variables
$env:DB_HOST = $DBHost
$env:DB_PORT = $DBPort
$env:DB_USER = $DBUser  
$env:DB_PASSWORD = $DBPassword
$env:DB_NAME = $DBName

Write-Host "🏁 Bắt đầu import sản phẩm từ HACOM..." -ForegroundColor Cyan
Write-Host "Database: $DBHost`:$DBPort/$DBName" -ForegroundColor Gray
Write-Host "User: $DBUser" -ForegroundColor Gray

# Change to script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Run the import script
try {
    node "import-hacom-products.js" $MaxProducts
    Write-Host "✅ Hoàn tất import process!" -ForegroundColor Green
} catch {
    Write-Host "❌ Lỗi khi chạy import script: $_" -ForegroundColor Red
    exit 1
}

# Wait for user input before closing
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Yellow
Read-Host 