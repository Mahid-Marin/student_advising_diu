Write-Host "Starting Academic Atelier..." -ForegroundColor Cyan

# Backend API (port 8080)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\student advising\academic-atelier'; python backend_api.py" -WindowStyle Normal

# Groq AI API (port 8000) - Set GROQ_API_KEY environment variable before running
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\student advising\academic-atelier\python-api'; python -m uvicorn main:app --host 0.0.0.0 --port 8000" -WindowStyle Normal

Start-Sleep 3

# Frontend (port 3000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\student advising\academic-atelier\frontend'; npm run dev -- --port 3000" -WindowStyle Normal

Write-Host ""
Write-Host "Services starting in separate windows." -ForegroundColor Green
Write-Host "Open http://localhost:3000 in your browser." -ForegroundColor Yellow
Write-Host "Login: student@example.com / password" -ForegroundColor Yellow
