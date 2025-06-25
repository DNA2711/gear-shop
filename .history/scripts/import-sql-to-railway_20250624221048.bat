@echo off
echo ==========================================
echo Import SQL File to Railway MySQL
echo ==========================================

REM ⚠️ UPDATE THESE WITH YOUR RAILWAY CREDENTIALS ⚠️
REM Go to Railway > Your MySQL Service > Variables tab
set RAILWAY_HOST=containers-us-west-xxx.railway.app
set RAILWAY_PORT=6543
set RAILWAY_USER=root
set RAILWAY_PASSWORD=CHANGE-THIS-TO-YOUR-RAILWAY-PASSWORD
set RAILWAY_DATABASE=railway

REM Path to your SQL backup file
set SQL_FILE=backup\gear_shop_backup.sql

echo.
echo 📝 Before running this script:
echo 1. Update Railway credentials above (lines 6-10)
echo 2. Make sure your SQL file exists at: %SQL_FILE%
echo 3. Install MySQL client if not already installed
echo.

REM Check if SQL file exists
if not exist "%SQL_FILE%" (
    echo ❌ SQL file not found: %SQL_FILE%
    echo.
    echo Create your backup first:
    echo   mysqldump -u root -p gear_shop ^> backup\gear_shop_backup.sql
    echo.
    pause
    exit /b 1
)

echo 🚀 Importing SQL file to Railway...
echo Host: %RAILWAY_HOST%
echo Port: %RAILWAY_PORT%
echo Database: %RAILWAY_DATABASE%
echo File: %SQL_FILE%
echo.

REM Import the SQL file
mysql -h %RAILWAY_HOST% -P %RAILWAY_PORT% -u %RAILWAY_USER% -p%RAILWAY_PASSWORD% %RAILWAY_DATABASE% < "%SQL_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Import successful!
    echo 🎉 Your database is now on Railway
    echo.
    echo 📌 Next steps:
    echo 1. Update Vercel environment variables
    echo 2. Test connection: node scripts/test-railway-connection.js
    echo 3. Deploy to Vercel
) else (
    echo.
    echo ❌ Import failed!
    echo.
    echo 🔍 Common issues:
    echo 1. Wrong Railway credentials
    echo 2. MySQL client not installed
    echo 3. Network connection issues
    echo 4. SQL file has syntax errors
)

echo.
pause 