@echo off
set GIT="C:\Users\Thao Nguyen\AppData\Local\Temp\mingit\cmd\git.exe"
%GIT% add .
%GIT% commit -m "fix: sync 100% data metrics between KPI cards and sections 4/5, expand lost sale section 5 with 6 full columns"
%GIT% push origin main
