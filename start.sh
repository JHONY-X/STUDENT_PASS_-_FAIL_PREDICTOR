#!/bin/bash

# Start script for Student Pass/Fail Predictor

echo "Starting Backend API..."
cd backend
# Ensure virtual environment exists
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
# Install backend dependencies
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "Both services started."
echo "Backend running on http://localhost:5000"
echo "Frontend running on http://localhost:5174/STUDENT_PASS_-_FAIL_PREDICTOR/"

echo "Press Ctrl+C to stop both services"
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
