from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='student') # student or admin
    major = db.Column(db.String(100), nullable=True)
    profile_image = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    records = db.relationship('StudentRecord', backref='student', lazy=True)

class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Store a few key inputs for history/dashboard purposes
    study_hours = db.Column(db.Float, nullable=True)
    attendance = db.Column(db.Float, nullable=True)
    sleep_hours = db.Column(db.Float, nullable=True)
    stress_level = db.Column(db.Float, nullable=True)
    
    prediction_result = db.Column(db.String(10), nullable=False) # PASS / FAIL
    confidence = db.Column(db.Float, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
