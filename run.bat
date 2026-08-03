@echo off
echo ==========================================
echo Starting OmniRoute Proof of Concept
echo ==========================================
echo.
echo Installing dependencies (if any are missing)...
call npm install

echo.
echo Starting frontend and backend concurrently...
call npm run dev

pause
