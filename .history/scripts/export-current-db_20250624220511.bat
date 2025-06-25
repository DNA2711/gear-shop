@echo off
echo ========================================
echo Export Current Database to Railway
echo ========================================

REM Set your current database credentials
set LOCAL_HOST=localhost
set LOCAL_PORT=3306
set LOCAL_USER=root
set LOCAL_PASSWORD=123456
set LOCAL_DATABASE=gear_shop

REM Create backup directory
if not exist "backup" mkdir backup

REM Get current timestamp for filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"

REM Export database structure and data
echo Exporting database structure and data...
mysqldump -h %LOCAL_HOST% -P %LOCAL_PORT% -u %LOCAL_USER% -p%LOCAL_PASSWORD% ^
  --routines --triggers --single-transaction --add-drop-table ^
  --databases %LOCAL_DATABASE% > backup\gear_shop_backup_%timestamp%.sql

if %ERRORLEVEL% EQU 0 (
    echo ✅ Export successful!
    echo File: backup\gear_shop_backup_%timestamp%.sql
    echo.
    echo Next steps:
    echo 1. Copy the backup file content
    echo 2. Run it in Railway MySQL console
    echo 3. Update environment variables in Vercel
) else (
    echo ❌ Export failed! Check your database credentials.
)

echo.
echo Press any key to continue...
pause > nul 