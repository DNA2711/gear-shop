@echo off
echo Fixing Vietnamese charset in Railway database...

mysql -h caboose.proxy.rlwy.net -P 29150 -u root -pRTbPDjFprveDAFWcKaIjOpiFimetgWdR --default-character-set=utf8mb4 railway < fix-vietnamese-charset.sql

echo Charset fixed! Vietnamese characters should now display correctly.
pause 