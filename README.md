# Student Pass/Fail Predictor

A modern, full-stack web application powered by Machine Learning that predicts whether a student is likely to Pass or Fail based on academic, behavioral, and lifestyle factors.

## Features
- **Machine Learning Integration**: Built with Scikit-learn Random Forest Classifier.
- **RESTful API Backend**: Flask, SQLAlchemy, JWT Authentication.
- **Modern UI/UX**: React, Vite, Recharts, CSS Glassmorphism.
- **Predictive Analytics Dashboard**: Pie charts and Bar charts tracking prediction history.
- **Secure Authentication**: Bcrypt password hashing and JWT token management.

## Setup Instructions

### 1. Requirements
- Node.js 18+
- Python 3.8+

### 2. Run the application
You can simply run the provided `start.sh` script to start both the Frontend and Backend simultaneously.

```bash
chmod +x start.sh
./start.sh
```

### 3. Database Configuration (Optional)
By default, the backend uses a local SQLite database for ease of use. To switch to MySQL as required for production:
1. Open `backend/app.py`.
2. Change the `SQLALCHEMY_DATABASE_URI`:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/db_name'
   ```

### 4. Machine Learning Model
The ML model is automatically generated via a synthetic dataset the first time `train_model.py` runs. 
If you wish to re-train the model, run:
```bash
cd backend
source venv/bin/activate
python train_model.py
```
