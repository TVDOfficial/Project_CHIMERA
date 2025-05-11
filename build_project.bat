@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ===========================================
echo Building Project CHIMERA for Distribution
echo ===========================================
echo.

SET "DIST_DIR=dist"
echo Current DIST_DIR is: %DIST_DIR%
echo.

REM --- Clean the existing dist directory ---
echo Checking if %DIST_DIR% exists...

IF EXIST "%DIST_DIR%" (
    echo '%DIST_DIR%' exists. Attempting to clean...
    rd /S /Q "%DIST_DIR%"
    IF ERRORLEVEL 1 (
        echo Warning: Could not completely remove old '%DIST_DIR%'. Check for locked files.
    ) ELSE (
        echo '%DIST_DIR%' cleaned successfully.
    )
) ELSE (
    echo No existing '%DIST_DIR%' directory found. Proceeding with build.
)
echo After IF block for DIST_DIR cleanup.
echo.

echo Creating %DIST_DIR% directory before Parcel build...
mkdir "%DIST_DIR%"
echo.

echo Starting Parcel build...
npm run build
echo Parcel build command finished. Checking results...
echo.

pause

ENDLOCAL