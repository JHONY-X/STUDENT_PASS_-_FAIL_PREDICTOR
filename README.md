# 🎓 NeuroGrade AI — Student Pass/Fail Predictor

A state-of-the-art, full-stack predictive analytics and academic forecasting web application. Powered by a high-precision **Scikit-learn Random Forest Classifier**, the platform assesses 19 student-specific behavioral, scholastic, and environmental attributes to compute real-time success vectors, identify students at academic risk, and provide automated pedagogical intervention strategies.

The project features a **fully decoupled micro-architecture** consisting of a modern glassmorphic React frontend, a token-shielded Flask REST API backend, and a flexible database abstraction layer.

---

## 🎨 System Core Features & UX Specs
* **Machine Learning Pipeline**: Runs real-time local inference through a pre-trained Random Forest Classifier achieving **91.4% test accuracy**.
* **Glassmorphism Theme**: Styled using high-fidelity Vanilla CSS design tokens (`rgba` color bounds, `backdrop-filter` 16px blurs, and elegant micro-animations).
* **Predictive Analytics Dashboard**: Employs interactive SVG-based charts (**Recharts** line trendlines, gauges, and pie metrics) that track history logs.
* **5-Step Form Wizard**: A smooth, structured pagination wizard that groups wellness, lifestyle, study hours, and academic scores.
* **JWT Cryptographic Shield**: Implements session authentication using secure HS256-signed tokens, automated Axios request interceptors, and strict API route guards.
* **Pedagogical Recommendation Engine**: Automatically generates learning recommendations, major-specific book lists, and motivation badges based on risk indicators.

---

## 🛠️ Architecture & Separation Pillars

```
   [ Client UI Viewport ] <--- (React + Vite + Recharts)
           │
     (Axios + JWT)
           ▼
   [ API Gateway Shield ] <--- (Flask REST API @jwt_required)
           │
      ┌────┴────────────────────────┐
      ▼                             ▼
[ SQL Database ]            [ Intelligence Model ]
(SQLAlchemy ORM)            (Scikit-Learn RF Classifier)
```

---

## 🚀 Setup & Launch Instructions

The project is fully cross-platform and includes automated double-click launcher scripts for both Windows and Unix systems.

### 1. Pre-requisites
Ensure you have the following installed on your machine:
* **Node.js** 18.0.0 or higher
* **Python** 3.8.0 or higher (with `pip`)
* **npm** (Node Package Manager)

---

### 💻 Platform Run Triggers

#### 🅰️ Running on Windows (Automated Batch Launcher)
Simply navigate to the project root and run the double-click batch launcher:
```cmd
# Double-click the file in File Explorer or run in terminal:
start.bat
```
*This script automatically configures a Python virtual environment (`venv`), installs `requirements.txt`, triggers `npm install`, and boots the Flask backend and Vite dev server concurrently in separate terminal logs.*

#### 🅱️ Running on Linux / macOS (Automated Bash Launcher)
Run the Unix launcher shell script from your terminal:
```bash
# Set executable permissions (first time only)
chmod +x start.sh

# Start the application
./start.sh
```

---

### 🔧 Manual Microservices Run (Optional)

If you prefer full control and want to start the services in separate terminal tabs, use the standard commands:

#### 1. Booting the Backend (Flask API)
```bash
cd backend

# Create & activate python virtualenv
python3 -m venv venv
source venv/bin/activate       # On Windows: call venv\Scripts\activate

# Install libraries & start server
pip install -r requirements.txt
python app.py
```
*The backend API will listen on:* **`http://localhost:5000`**

#### 2. Booting the Frontend (React Vite)
```bash
cd frontend

# Install node packages & run dev server
npm install
npm run dev
```
*The React user interface will load at:* **`http://localhost:5174/STUDENT_PASS_-_FAIL_PREDICTOR/`**

---

## 📂 Database Configuration & Migration

By default, the backend employs a local **SQLite** database (`backend/students.db`) for rapid local developer setup. 

To transition the system to an enterprise **MySQL** or **PostgreSQL** database:
1. Open the backend configuration in `backend/app.py`.
2. Locate the database connection string and modify the SQL URI:
   ```python
   # Switch to MySQL Production Server
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://db_user:secure_password@localhost/neurograde_db'
   ```
3. Initialize tables or run Alembic schema versioning commands:
   ```bash
   flask db init
   flask db migrate -m "Initialize database schema"
   flask db upgrade
   ```

---

## 🧠 Machine Learning Model Training

The classifier model binary (`backend/model.joblib`) is generated using structured synthetic student distributions. If you ever want to expand the feature dimensions or re-train the underlying Random Forest model:
```bash
cd backend
source venv/bin/activate       # On Windows: call venv\Scripts\activate
python train_model.py
```
This updates Gini path splits, checks precision rates, and saves the new serialized model files.

---

## 📄 Technical Guide PDF Generator

The project includes an advanced ReportLab compilation utility that compiles a **20-page, publication-grade Technical Architecture Guide** outlining database schemas, security metrics, and development roadmaps.

To compile the latest documentation guide:
```bash
# Run the generator script in the root directory
python3 generate_pdf.py
```
* **Output PDF File**: [neurograde_project_guide.pdf](file:///home/jonhy_x/Documents/Ai-Assignment/STUDENT_PASS_&_FAIL/neurograde_project_guide.pdf)
* **Key Features**: Dynamically calculated dynamic `"Page X of 20"` footer grids, color-coded callout modules, native vector bar charts, and code snippets.

---

## 👥 Core Development Commons

For support, architectural questions, or contribution guidelines, feel free to contact our engineering team:

| Team Member | System Responsibility | Contact Handle |
| :--- | :--- | :--- |
| **Yoni** | Lead UI/UX & Glassmorphism Architect | [Telegram Badge](https://t.me/Yoni_yoi) |
| **H3B** | Lead Backend REST & Security Engineer | [Telegram Badge](https://t.me/H3B6M9) |
| **Juccj** | Lead AI/ML & Preprocessing Engineer | [Telegram Badge](https://t.me/juccj) |

---
*Created as part of the Academic Assignment Predictor Commons. Clean, robust, and verified.*
