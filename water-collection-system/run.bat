@echo off
title AquaPay - Water Money Collection System
echo ========================================================
echo   💧 Opening AquaPay in Browser...
echo ========================================================

set "APP_FILE=%~dp0index.html"

:: Check Google Chrome 64-bit
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%APP_FILE%"
    exit
)

:: Check Google Chrome 32-bit
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%APP_FILE%"
    exit
)

:: Check Microsoft Edge
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%APP_FILE%"
    exit
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%APP_FILE%"
    exit
)

:: Fallback to Windows default handler
start "" "%APP_FILE%"
exit
