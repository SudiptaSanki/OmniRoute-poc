@echo off
echo ==========================================
echo Starting OmniRoute Proof of Concept
echo ==========================================
echo.
IF NOT EXIST "node_modules\" (
    echo Installing dependencies...
    call npm install
) ELSE (
    echo Dependencies already installed. Skipping npm install.
)

echo.
echo Starting frontend and backend concurrently...
call npm run dev

pause
