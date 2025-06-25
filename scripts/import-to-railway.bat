@echo off
echo ========================================
echo Import Database to Railway MySQL
echo ========================================

REM Railway connection details (Update these with your Railway credentials)
set RAILWAY_HOST=containers-us-west-xxx.railway.app
set RAILWAY_PORT=6543
set RAILWAY_USER=root
set RAILWAY_PASSWORD=your-railway-password
set RAILWAY_DATABASE=railway

REM Backup file path
set BACKUP_FILE=backup\gear_shop_backup_latest.sql

echo Importing database to Railway...
echo Host: %RAILWAY_HOST%
echo Port: %RAILWAY_PORT%
echo Database: %RAILWAY_DATABASE%
echo.

REM Import the backup file
mysql -h %RAILWAY_HOST% -P %RAILWAY_PORT% -u %RAILWAY_USER% -p%RAILWAY_PASSWORD% %RAILWAY_DATABASE% < %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo ✅ Import successful!
    echo Your database is now on Railway
    echo.
    echo Next step: Update Vercel environment variables
) else (
    echo ❌ Import failed! Check Railway credentials and backup file.
)

echo.
echo Press any key to continue...
pause > nul 