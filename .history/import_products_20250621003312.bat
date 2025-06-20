@echo off
echo Importing products to gear_shop database...
mysql -u root -p123456 gear_shop < database/real_products_data.sql
if %ERRORLEVEL% == 0 (
    echo Products imported successfully!
    mysql -u root -p123456 -e "USE gear_shop; SELECT COUNT(*) as total_products FROM products;"
) else (
    echo Error occurred during import!
)
pause 