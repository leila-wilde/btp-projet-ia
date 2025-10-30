@echo off
REM Installation and Launch Script for L'Archipel Libre Web Platform

echo.
echo ==========================================
echo L'Archipel Libre Web Platform
echo Installation ^& Launch Script
echo ==========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo + Node.js %NODE_VERSION% found
echo.

REM Check npm
echo Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo + npm %NPM_VERSION% found
echo.

REM Navigate to frontend
echo Navigating to frontend directory...
cd frontend
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to navigate to frontend directory
    pause
    exit /b 1
)
echo + In frontend directory
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies ^(this may take a few minutes^)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo X npm install failed
        pause
        exit /b 1
    )
    echo + Dependencies installed
) else (
    echo + Dependencies already installed
)
echo.

REM Start the dev server
echo Starting development server...
echo The application will open at http://localhost:4200/
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

call npm start
pause
