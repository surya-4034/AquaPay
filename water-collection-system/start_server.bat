@echo off
title AquaPay Server
echo ========================================================
echo   💧 Starting AquaPay Backend Server...
echo ========================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Node.js is not installed locally.
    echo Opening web app directly in your browser...
    start "" "%~dp0index.html"
    exit /b
)

echo Starting server on http://localhost:3000 ...
start "" "http://localhost:3000"
node "%~dp0server.js"
pause
