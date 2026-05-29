@echo off
title NeuroGrade AI - Launcher
echo ====================================================================
echo                NEUROGRADE AI - WINDOWS LAUNCHER                      
echo ====================================================================
echo.

:: 1. Launching Backend API in a new terminal window
echo [Step 1/2] Launching Backend Flask API...
start "NeuroGrade Backend API" cmd /c "cd backend && (if not exist venv (echo Creating virtual environment... && python -m venv venv)) && echo Activating virtual environment... && call venv\Scripts\activate && echo Installing dependencies... && pip install -r requirements.txt && echo Starting Flask Server... && python app.py"

echo.
:: 2. Launching Frontend React App in a new terminal window
echo [Step 2/2] Launching Frontend React App (Vite)...
start "NeuroGrade Frontend React" cmd /c "cd frontend && echo Installing npm dependencies... && npm install && echo Starting Vite Dev Server... && npm run dev"

echo.
echo ====================================================================
echo [Success] Both services have been launched in separate terminals!
echo --------------------------------------------------------------------
echo  - Backend API: http://localhost:5000
echo  - Frontend UI: http://localhost:5174/STUDENT_PASS_-_FAIL_PREDICTOR/
echo.
echo Note: Simply close the respective terminal windows to stop the services.
echo ====================================================================
pause
