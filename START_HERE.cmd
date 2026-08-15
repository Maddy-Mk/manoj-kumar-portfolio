@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo ============================================================
echo   MANOJ KUMAR PORTFOLIO - SETUP AND RUN
echo ============================================================
echo.

if not exist "package.json" goto missing_project

echo [1/3] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 goto missing_node

where npm >nul 2>&1
if errorlevel 1 goto missing_npm

for /f "delims=" %%V in ('node --version') do set "NODE_VERSION=%%V"
echo       Found Node.js %NODE_VERSION%

node -e "const [major, minor] = process.versions.node.split('.').map(Number); process.exit((major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19)) ? 0 : 1)"
if errorlevel 1 goto outdated_node

if /i "%~1"=="--check" (
  echo.
  echo Setup check passed. This computer can run the portfolio.
  exit /b 0
)

echo.
echo [2/3] Installing project dependencies...
echo       This can take a few minutes the first time.
call npm install --no-package-lock --no-fund --no-audit
if errorlevel 1 goto install_failed

echo.
echo [3/3] Starting the portfolio...
echo       The browser will open automatically when Vite is ready.
echo       Keep this window open. Press Ctrl+C here to stop the site.
echo.
call npm run dev -- --open
if errorlevel 1 goto run_failed

echo.
echo Portfolio server stopped.
pause
exit /b 0

:missing_project
echo ERROR: package.json was not found next to START_HERE.cmd.
echo Extract the complete ZIP before running this file.
goto failed

:missing_node
echo ERROR: Node.js is not installed or is not available on PATH.
echo.
echo Install the current Node.js LTS release, then restart Windows Terminal
echo or Command Prompt and run START_HERE.cmd again.
echo.
echo Download: https://nodejs.org/
echo Windows command: winget install --id OpenJS.NodeJS.LTS -e
goto failed

:missing_npm
echo ERROR: npm was not found. Reinstall Node.js LTS from https://nodejs.org/
goto failed

:outdated_node
echo ERROR: Node.js %NODE_VERSION% is too old for this portfolio.
echo Install Node.js 20.19 or newer from https://nodejs.org/
goto failed

:install_failed
echo ERROR: Dependency installation failed.
echo Check the internet connection, then run START_HERE.cmd again.
goto failed

:run_failed
echo ERROR: The development server stopped with an error.
goto failed

:failed
echo.
pause
exit /b 1
