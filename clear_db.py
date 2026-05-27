import os, sys

# Determine the absolute path to the backend directory and add it to sys.path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(BASE_DIR, 'backend'))

# Import the Flask app and database models
from app import app
from database import db, User, StudentRecord

def clear_database():
    """Delete all rows from User and StudentRecord tables safely."""
    with app.app_context():
        try:
            db.session.query(User).delete()
            db.session.query(StudentRecord).delete()
            db.session.commit()
            print('✅ All users and records have been cleared.')
        except Exception as e:
            db.session.rollback()
            print(f'❌ Failed to clear database: {e}')

if __name__ == '__main__':
    clear_database()

