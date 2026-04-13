@echo off
echo Starting Academic Atelier...

REM Kill any existing instances on these ports
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

REM Start Backend API (port 8080)
start "Backend API :8080" cmd /k "cd /d d:\student advising\academic-atelier && python backend_api.py"

REM Start Groq AI API (port 8000)
start "Groq AI API :8000" cmd /k "cd /d d:\student advising\academic-atelier\python-api && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

REM Start Frontend static server (port 3000)
start "Frontend :3000" cmd /k "cd /d d:\student advising\academic-atelier\frontend\dist && python -m http.server 3000"

timeout /t 3 /nobreak >nul

echo.
echo All services started in separate windows!
echo Open http://localhost:3000 in your browser.
echo Login: student@example.com / password
echo.
pause
