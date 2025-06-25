@echo off
echo Importing categories data to Railway...

mysql -h caboose.proxy.rlwy.net -P 29150 -u root -pRTbPDjFprveDAFWcKaIjOpiFimetgWdR railway < railway-categories-data.sql

echo Import completed!
pause 