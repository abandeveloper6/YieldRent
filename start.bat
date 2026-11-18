@echo off
title YieldRent Platform Launcher
color 0A

echo ========================================================
echo   YieldRent: Smart Farmer Machinery Rental
echo   & Live Weather Monitoring System
echo ========================================================
echo.

echo [1/2] Starting YieldRent Backend Server (Port 5000)...
start "YieldRent Backend (Port 5000)" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting YieldRent React Frontend (Port 3000)...
start "YieldRent Frontend (Port 3000)" cmd /k "cd client && npm run dev"

timeout /t 4 /nobreak >nul

echo.
echo ========================================================
echo   Opening YieldRent in your default browser...
echo   URL: http://localhost:3000
echo ========================================================
start http://localhost:3000

exit
