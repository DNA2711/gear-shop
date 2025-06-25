@echo off
echo ===============================================
echo Import SQL File to Railway - SIMPLE VERSION
echo ===============================================

REM 📋 TO DO: Fill in your Railway credentials below
REM Go to Railway > Your MySQL Service > Variables tab to get these:

set RAILWAY_HOST=PASTE_YOUR_HOST_HERE
set RAILWAY_PORT=PASTE_YOUR_PORT_HERE  
set RAILWAY_PASSWORD=PASTE_YOUR_PASSWORD_HERE

REM Your SQL file path (change if different)
set SQL_FILE=gear_shop_backup.sql

echo.
echo 🔧 Configuration:
echo Host: %RAILWAY_HOST%
echo Port: %RAILWAY_PORT%
echo File: %SQL_FILE%
echo.

REM Check if file exists
if not exist "%SQL_FILE%" (
    echo ❌ File not found: %SQL_FILE%
    echo Put your SQL file in the same folder as this script
    pause
    exit
)

echo 🚀 Importing to Railway...
mysql -h %RAILWAY_HOST% -P %RAILWAY_PORT% -u root -p%RAILWAY_PASSWORD% railway < "%SQL_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ SUCCESS! Database imported to Railway
) else (
    echo ❌ FAILED! Check your credentials
)

pause 