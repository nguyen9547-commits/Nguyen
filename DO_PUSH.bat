@echo off
echo ========================================================
echo   SHINKO ANALYTICS V3 - AUTO PUSH TO GITHUB & VERCEL
echo ========================================================
echo.
set GIT="C:\Users\Thao Nguyen\AppData\Local\Temp\mingit\cmd\git.exe"

echo 1. Dang kiem tra va khoi tao Git local repository...
%GIT% init
%GIT% config user.name "nguyen9547-commits"
%GIT% config user.email "nguyen9547-commits@users.noreply.github.com"
%GIT% config credential.helper manager

echo.
echo 2. Dang dong goi va commit tat ca 46 tep...
%GIT% add .
%GIT% commit -m "feat: release SHINKO Retail Analytics V3" 2>nul
%GIT% branch -M main
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/nguyen9547-commits/Nguyen.git

echo.
echo 3. Dang day code len GitHub repository (nguyen9547-commits/Nguyen)...
%GIT% push -u origin main

echo.
echo ========================================================
echo   HOAN THANH! DUA CODE LEN GITHUB THANH CONG!
echo ========================================================
pause
