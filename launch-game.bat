@echo off
setlocal

REM AIDEV-NOTE: Date-based port for 2026-02-27 => 22627
set PORT=22627
set URL=http://127.0.0.1:%PORT%/index.html

echo Starting PaperWorld at %URL%
start "" "%URL%"

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  py -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  python -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)

echo Python was not found. Install Python 3 and try again.
pause
