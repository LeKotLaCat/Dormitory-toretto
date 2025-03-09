for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F
start "Backend Install" cmd /k "cd blackend && npm install && node index.js"
start "Frontend Install" cmd /k "cd frontend && npm install && npm run dev"
:loop
curl -s -o nul -w "%%{http_code}" http://localhost:8000 > temp.txt
set /p status=<temp.txt
del temp.txt

if "%status%"=="200" (
    echo Server is up! Opening browser...
    start http://localhost:8000
    exit
) else (
    echo Server not available, retrying...
    timeout /t 2 >nul
    goto loop
)
cd ..
