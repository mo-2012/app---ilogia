@echo off
setlocal
cd /d "%~dp0..\.."

where py >nul 2>nul
if not errorlevel 1 (
  py -m http.server 8000 --directory apps\app---ilogia\public
  exit /b
)

where python >nul 2>nul
if not errorlevel 1 (
  python -m http.server 8000 --directory apps\app---ilogia\public
  exit /b
)

echo Python 3 is required to serve the static website locally.
echo You can also use the VS Code Live Server extension.
pause
