import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate features
    study_hours = np.random.randint(0, 14, num_samples)
    attendance = np.random.randint(50, 100, num_samples)
    prev_exam = np.random.randint(30, 100, num_samples)
    assignment_rate = np.random.randint(20, 100, num_samples)
    subjects = np.random.randint(3, 8, num_samples)
    quiz_perf = np.random.randint(30, 100, num_samples)
    
    sleep_hours = np.random.randint(3, 10, num_samples)
    social_media = np.random.randint(0, 8, num_samples)
    screen_time = np.random.randint(2, 12, num_samples)
    gaming_hours = np.random.randint(0, 8, num_samples)
    
    stress_level = np.random.randint(1, 11, num_samples)
    motivation = np.random.randint(1, 11, num_samples)
    participation = np.random.randint(0, 100, num_samples)
    revision = np.random.randint(0, 10, num_samples)
    anxiety = np.random.randint(1, 11, num_samples)
    
    internet = np.random.randint(0, 2, num_samples)
    family_support = np.random.randint(1, 11, num_samples)
    quiet_study = np.random.randint(0, 2, num_samples)
    tutoring = np.random.randint(0, 2, num_samples)
    
    # Simple logic for Pass/Fail based on features
    # Positive correlation with pass
    score = (study_hours * 2) + (attendance * 0.5) + (prev_exam * 0.3) + (assignment_rate * 0.2) + \
            (quiz_perf * 0.2) + (sleep_hours * 3) + (motivation * 2) + (participation * 0.1) + \
            (revision * 2) + (family_support * 1) + (quiet_study * 5) + (tutoring * 5)
    
    # Negative correlation with pass
    score -= (social_media * 2) + (screen_time * 1) + (gaming_hours * 2) + (stress_level * 2) + (anxiety * 2)
    
    # Normalize score somewhat and create a threshold
    median_score = np.median(score)
    
    # Add some noise
    noise = np.random.normal(0, 10, num_samples)
    score = score + noise
    
    # Define pass (1) or fail (0)
    # Let's say top 70% pass
    threshold = np.percentile(score, 30)
    passed = (score >= threshold).astype(int)
    
    df = pd.DataFrame({
        'study_hours': study_hours,
        'attendance': attendance,
        'prev_exam': prev_exam,
        'assignment_rate': assignment_rate,
        'subjects': subjects,
        'quiz_perf': quiz_perf,
        'sleep_hours': sleep_hours,
        'social_media': social_media,
        'screen_time': screen_time,
        'gaming_hours': gaming_hours,
        'stress_level': stress_level,
        'motivation': motivation,
        'participation': participation,
        'revision': revision,
        'anxiety': anxiety,
        'internet': internet,
        'family_support': family_support,
        'quiet_study': quiet_study,
        'tutoring': tutoring,
        'passed': passed
    })
    
    return df

def train_and_save_model():
    print("Generating dataset...")
    df = generate_synthetic_data(2000)
    
    # Save dataset for reference
    os.makedirs('model', exist_ok=True)
    df.to_csv('model/student_data.csv', index=False)
    
    X = df.drop('passed', axis=1)
    y = df['passed']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and feature names
    print("Saving model...")
    joblib.dump(model, 'model/student_rf_model.pkl')
    joblib.dump(list(X.columns), 'model/feature_names.pkl')
    print("Model saved to model/student_rf_model.pkl")

if __name__ == "__main__":
    train_and_save_model()
