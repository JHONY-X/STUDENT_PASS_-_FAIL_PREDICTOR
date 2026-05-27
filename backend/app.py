from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import joblib
import os
import numpy as np
import pandas as pd
from datetime import timedelta
from database import init_db, User, StudentRecord, db
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Configurations
# Using SQLite locally for ease of setup. Replace with 'mysql+pymysql://user:pass@localhost/db_name' for MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///student_predictor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-super-secret-jwt-key-which-is-at-least-32-bytes'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=3) # Increase to 3 days

init_db(app)
jwt = JWTManager(app)

@app.errorhandler(422)
def handle_422(e):
    app.logger.error(f"422 Error: {e.description}")
    return jsonify({"error": str(e.description)}), 422

# Load model and feature names safely
MODEL_PATH = 'model/student_rf_model.pkl'
FEATURES_PATH = 'model/feature_names.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURES_PATH)
else:
    model = None
    feature_names = None
    print("WARNING: Model not found. Please train the model first.")

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Student Pass/Fail Predictor API. Please visit the frontend application at http://localhost:5173"
    })

def get_major_recommendations(major):
    major = (major or '').lower()
    if 'computer' in major or 'software' in major or 'it' in major:
        return "Tools: GitHub, VS Code, Notion. Books: 'Clean Code', 'Cracking the Coding Interview'. Study Style: Project-based learning, active coding."
    elif 'medic' in major or 'nurs' in major or 'health' in major:
        return "Tools: Anki, Complete Anatomy. Books: 'Gray's Anatomy', 'Harrison's Principles'. Study Style: Spaced repetition, active recall."
    elif 'engineer' in major:
        return "Tools: MATLAB, AutoCAD. Books: 'Shigley's Mechanical Engineering Design'. Study Style: Practice problem-solving, group study."
    elif 'business' in major or 'finance' in major or 'econ' in major:
        return "Tools: Excel, Bloomberg Terminal. Books: 'The Lean Startup', 'Thinking, Fast and Slow'. Study Style: Case studies, networking."
    elif 'art' in major or 'design' in major:
        return "Tools: Adobe Creative Cloud, Figma. Books: 'The Design of Everyday Things', 'Steal Like an Artist'. Study Style: Portfolio building."
    elif major != '':
        return f"Tools: Notion, Quizlet, Evernote. Books: 'Atomic Habits', 'Make It Stick'. Study Style: Pomodoro technique tailored for {major.title()}."
    else:
        return "Tools: Notion, Quizlet. Books: 'Atomic Habits', 'Make It Stick'. Study Style: Spaced repetition, Pomodoro."

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student') # 'student' or 'admin'
    
    major = data.get('major', '').lower()
    profile_image = data.get('profile_image', None)
    
    # Check for existing email (must be unique)
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    # Allow duplicate usernames by generating a unique username if needed
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        # Create a short hash suffix from email to differentiate users with same username
        import hashlib
        suffix = hashlib.sha256(email.encode()).hexdigest()[:6]
        username = f"{username}_{suffix}"

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        role=role,
        major=major,
        profile_image=profile_image,
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        recommendation = get_major_recommendations(major)
        return jsonify({"msg": "User created successfully", "username": username, "recommendation": recommendation}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error creating user", "error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, user={'username': user.username, 'role': user.role, 'email': user.email, 'major': user.major or '', 'profileIcon': user.profile_image})
    
    return jsonify({"msg": "Bad email or password"}), 401

@app.route('/api/auth/profile-image', methods=['PUT'])
@jwt_required()
def update_profile_image():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    data = request.json
    profile_image = data.get('profile_image')
    
    if not profile_image:
        return jsonify({"msg": "No image provided"}), 400
        
    try:
        user.profile_image = profile_image
        db.session.commit()
        return jsonify({"msg": "Profile image updated", "profileIcon": user.profile_image}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update profile image", "error": str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "major": user.major or '',
        "profileIcon": user.profile_image,
        "created_at": user.created_at.strftime("%Y-%m-%d") if user.created_at else None
    }), 200

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    data = request.json
    username = data.get('username')
    email = data.get('email')
    major = data.get('major')
    
    if username and username != user.username:
        if User.query.filter_by(username=username).first():
            return jsonify({"msg": "Username already taken"}), 400
        user.username = username
        
    if email and email != user.email:
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "Email already in use"}), 400
        user.email = email
        
    if major is not None:
        user.major = major
        
    try:
        db.session.commit()
        return jsonify({
            "msg": "Profile updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "major": user.major,
                "profileIcon": user.profile_image
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update profile", "error": str(e)}), 500


# Prediction Route
@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    if model is None:
        return jsonify({"error": "Model not trained yet."}), 500
        
    data = request.json
    
    try:
        # Construct feature vector based on feature_names order
        features = []
        for feature in feature_names:
            val = data.get(feature)
            if val == "" or val is None:
                val = 0
            features.append(float(val))
            
        feature_df = pd.DataFrame([features], columns=feature_names)
        
        # Predict
        prediction = model.predict(feature_df)[0]
        probabilities = model.predict_proba(feature_df)[0]
        confidence = float(max(probabilities) * 100)
        
        result = "PASS" if prediction == 1 else "FAIL"
        
        # Determine risk level
        if result == "PASS" and confidence >= 80:
            risk_level = "Low"
        elif result == "PASS":
            risk_level = "Medium"
        elif result == "FAIL" and confidence >= 80:
            risk_level = "High"
        else:
            risk_level = "Medium"
            
        # Generate some basic recommendations based on inputs
        recommendations = []
        if float(data.get('study_hours', 0)) < 4:
            recommendations.append("Increase study hours to at least 4-5 hours per day.")
        if float(data.get('attendance', 100)) < 80:
            recommendations.append("Improve attendance, aim for above 85%.")
        if float(data.get('sleep_hours', 8)) < 6:
            recommendations.append("Ensure you get at least 7 hours of sleep.")
        if float(data.get('social_media', 0)) > 4:
            recommendations.append("Reduce social media usage to allocate more time for studying.")
        if not recommendations:
            recommendations.append("Maintain current study habits.")
            recommendations.append("Review topics consistently.")
            
        # Add major-specific recommendations
        major = data.get('major', '').lower()
        if 'computer' in major or 'software' in major or 'it' in major:
            recommendations.append("Tools: GitHub, VS Code, Notion. Books: 'Clean Code', 'Cracking the Coding Interview'. Study Style: Project-based learning, active coding.")
        elif 'medic' in major or 'nurs' in major or 'health' in major:
            recommendations.append("Tools: Anki, Complete Anatomy. Books: 'Gray's Anatomy', 'Harrison's Principles'. Study Style: Spaced repetition, active recall, flashcards.")
        elif 'engineer' in major:
            recommendations.append("Tools: MATLAB, AutoCAD, Wolfram Alpha. Books: 'Shigley's Mechanical Engineering Design'. Study Style: Practice problem-solving, group study.")
        elif 'business' in major or 'finance' in major or 'econ' in major:
            recommendations.append("Tools: Excel, Bloomberg Terminal, Trello. Books: 'The Lean Startup', 'Thinking, Fast and Slow'. Study Style: Case studies, networking.")
        elif 'art' in major or 'design' in major:
            recommendations.append("Tools: Adobe Creative Cloud, Figma, Procreate. Books: 'The Design of Everyday Things', 'Steal Like an Artist'. Study Style: Portfolio building, critique sessions.")
        elif major != '':
            recommendations.append(f"Tools: Notion, Quizlet, Evernote. Books: 'Atomic Habits', 'Make It Stick'. Study Style: Pomodoro technique, Feynman technique tailored for {major.title()}.")
        
        response = {
            "prediction": result,
            "confidence": round(confidence, 2),
            "risk_level": risk_level,
            "recommendations": recommendations
        }
        
        # If user is logged in, save the record
        current_user_id = get_jwt_identity()
        if current_user_id:
            record = StudentRecord(
                user_id=int(current_user_id),
                study_hours=data.get('study_hours'),
                attendance=data.get('attendance'),
                sleep_hours=data.get('sleep_hours'),
                stress_level=data.get('stress_level'),
                prediction_result=result,
                confidence=round(confidence, 2)
            )
            db.session.add(record)
            db.session.commit()
            
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Dashboard Route
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    
    if user.role == 'admin':
        # Admin sees overall stats
        users = User.query.filter_by(role='student').all()
        user_list = [{"id": u.id, "username": u.username, "email": u.email, "created_at": u.created_at.strftime("%Y-%m-%d")} for u in users]
        records = StudentRecord.query.all()
    else:
        # Student sees their own stats
        user_list = []
        records = StudentRecord.query.filter_by(user_id=user.id).all()
        
    history = [
        {
            "date": r.created_at.strftime("%Y-%m-%d"),
            "prediction": r.prediction_result,
            "confidence": r.confidence,
            "study_hours": r.study_hours,
            "attendance": r.attendance,
            "sleep_hours": r.sleep_hours,
            "stress_level": r.stress_level,
            "username": r.student.username if user.role == 'admin' else None
        } for r in records
    ]
    
    pass_count = sum(1 for r in records if r.prediction_result == "PASS")
    fail_count = len(records) - pass_count
    
    return jsonify({
        "history": history,
        "pass_count": pass_count,
        "fail_count": fail_count,
        "total_predictions": len(records),
        "users": user_list,
        "recommendation": get_major_recommendations(user.major)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
