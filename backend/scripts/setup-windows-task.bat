@echo off
REM MongoDB Atlas Keep-Alive Windows Task Scheduler Setup
REM This script creates a Windows scheduled task to keep MongoDB Atlas alive

echo 🚀 Setting up MongoDB Atlas Keep-Alive Windows Task...

REM Get current directory
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set KEEP_ALIVE_SCRIPT=%SCRIPT_DIR%keep-atlas-alive.js

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found in PATH
    echo Please install Node.js or add it to your PATH
    pause
    exit /b 1
)

REM Get Node.js path
for /f "tokens=*" %%i in ('where node') do set NODE_PATH=%%i

echo ✅ Node.js found at: %NODE_PATH%
echo ✅ Keep-alive script: %KEEP_ALIVE_SCRIPT%

REM Create logs directory
if not exist "%PROJECT_DIR%\logs" mkdir "%PROJECT_DIR%\logs"

REM Delete existing task if it exists
schtasks /delete /tn "MongoDB Atlas Keep-Alive" /f >nul 2>nul

REM Create new scheduled task
echo 📝 Creating Windows scheduled task...

schtasks /create ^
    /tn "MongoDB Atlas Keep-Alive" ^
    /tr "cmd /c cd /d \"%PROJECT_DIR%\" && \"%NODE_PATH%\" \"%KEEP_ALIVE_SCRIPT%\" >> logs\keep-alive.log 2>&1" ^
    /sc minute ^
    /mo 20 ^
    /ru "SYSTEM" ^
    /rl highest ^
    /f

if %ERRORLEVEL% EQU 0 (
    echo ✅ Windows scheduled task created successfully!
    echo.
    echo 📋 Task Details:
    echo    Name: MongoDB Atlas Keep-Alive
    echo    Schedule: Every 20 minutes
    echo    Script: %KEEP_ALIVE_SCRIPT%
    echo    Log: %PROJECT_DIR%\logs\keep-alive.log
    echo.
    echo 🔍 To view the task:
    echo    schtasks /query /tn "MongoDB Atlas Keep-Alive"
    echo.
    echo 📊 To view logs:
    echo    type "%PROJECT_DIR%\logs\keep-alive.log"
    echo.
    echo 🗑️ To delete the task:
    echo    schtasks /delete /tn "MongoDB Atlas Keep-Alive" /f
    echo.
    echo 🎯 MongoDB Atlas will now stay alive with pings every 20 minutes!
) else (
    echo ❌ Failed to create scheduled task
    echo Please run this script as Administrator
)

echo.
echo ✅ Setup completed!
pause
