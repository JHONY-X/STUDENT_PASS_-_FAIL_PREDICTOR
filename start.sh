#!/bin/bash
# Start script for Student Pass/Fail Predictor

echo "Starting Backend API..."
cd backend
# Ensure model exists
if [ ! -f "model/student_rf_model.pkl" ]; then
    echo "Training model for the first time..."
    source venv/bin/activate
    python train_model.py
fi

source venv/bin/activate
python app.py &
BACKEND_PID=$!

echo "Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Both services started."
echo "Backend running on http://localhost:4000"
echo "Frontend running on http://localhost:5174"
echo "Press Ctrl+C to stop both services"

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
