#!/usr/bin/env python3
"""
Academic Atelier Backend API - Python Implementation
Replaces Spring Boot for quick deployment
Runs on Port 8080
"""
import json
import os
import sys
import sqlite3
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path
from datetime import datetime
import hashlib
import secrets

# Load environment
def load_env():
    env_file = Path(__file__).parent.parent / 'backend' / '.env'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value

load_env()

# Database setup
DB_FILE = r'd:\student advising\academic_atelier.db'
GROQ_API_URL = 'http://localhost:8000'

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    # Students table
    c.execute('''CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        password TEXT,
        gpa REAL DEFAULT 0.0,
        attendance INTEGER DEFAULT 0,
        risk_status TEXT DEFAULT 'LOW',
        created_at TIMESTAMP
    )''')
    
    # Courses table
    c.execute('''CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY,
        code TEXT UNIQUE,
        name TEXT,
        instructor TEXT,
        credits INTEGER
    )''')
    
    # Performance table
    c.execute('''CREATE TABLE IF NOT EXISTS performance (
        id INTEGER PRIMARY KEY,
        student_id INTEGER,
        course_id INTEGER,
        marks INTEGER,
        attendance INTEGER,
        engagement INTEGER,
        semester TEXT,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )''')
    
    # Sample data
    c.execute('SELECT COUNT(*) FROM students')
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO students (email, name, password, gpa, attendance) VALUES (?, ?, ?, ?, ?)",
                 ('student@example.com', 'John Doe', hashlib.sha256('password'.encode()).hexdigest(), 3.5, 85))
        c.execute("INSERT INTO courses (code, name, instructor, credits) VALUES (?, ?, ?, ?)",
                 ('CS101', 'Python Programming', 'Dr. Smith', 4))
        c.execute("INSERT INTO performance (student_id, course_id, marks, attendance, engagement, semester) VALUES (?, ?, ?, ?, ?, ?)",
                 (1, 1, 85, 90, 80, 'Spring2024'))
        conn.commit()
    
    conn.close()

init_db()

class BackendHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        path = urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body) if body else {}
        except:
            self.send_json({"error": "Invalid JSON"}, 400)
            return
        
        # Authentication endpoints
        if path == '/api/auth/login':
            email = data.get('email')
            password = data.get('password')
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('SELECT id, name, email FROM students WHERE email=? AND password=?',
                     (email, hashlib.sha256(password.encode()).hexdigest()))
            student = c.fetchone()
            conn.close()
            
            if student:
                self.send_json({
                    "success": True,
                    "token": secrets.token_hex(32),
                    "user": {"id": student[0], "name": student[1], "email": student[2]}
                })
            else:
                self.send_json({"success": False, "error": "Invalid credentials"}, 401)
        
        elif path == '/api/auth/register':
            email = data.get('email')
            name = data.get('name')
            password = data.get('password')
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            try:
                c.execute("INSERT INTO students (email, name, password, created_at) VALUES (?, ?, ?, ?)",
                         (email, name, hashlib.sha256(password.encode()).hexdigest(), datetime.now()))
                conn.commit()
                self.send_json({"success": True, "message": "Student registered"})
            except sqlite3.IntegrityError:
                self.send_json({"success": False, "error": "Email already exists"}, 400)
            finally:
                conn.close()
        
        # Learning endpoints
        elif path == '/api/learning/record-performance':
            student_id = data.get('student_id')
            marks = data.get('marks')
            attendance = data.get('attendance')
            engagement = data.get('engagement')
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute("INSERT INTO performance (student_id, marks, attendance, engagement, semester) VALUES (?, ?, ?, ?, ?)",
                     (student_id, marks, attendance, engagement, 'Spring2024'))
            conn.commit()
            conn.close()
            
            self.send_json({"success": True, "message": "Performance recorded"})
        
        # Knowledge base endpoints
        elif path == '/api/knowledge-base/search':
            query = data.get('query', '')
            self.send_json({
                "success": True,
                "results": [
                    {"id": 1, "title": "Study Tips", "category": "FAQ", "content": "Effective study techniques..."},
                    {"id": 2, "title": "Course Policies", "category": "POLICY", "content": "Academic policies..."}
                ]
            })
        
        # Chatbot endpoint (proxy to Groq)
        elif path == '/api/chatbot/message':
            import urllib.request
            message = data.get('message')
            session_id = data.get('session_id', 'default')
            
            try:
                req = urllib.request.Request(
                    f'{GROQ_API_URL}/chat/',
                    data=json.dumps({"student_id": 1, "message": message, "session_id": session_id}).encode(),
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req) as response:
                    groq_response = json.loads(response.read().decode())
                    self.send_json(groq_response)
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
        
        else:
            self.send_json({"error": "Endpoint not found"}, 404)
    
    def do_GET(self):
        path = urlparse(self.path).path
        
        if path == '/api/health':
            self.send_json({"status": "ok", "service": "academic-atelier-backend"})
        
        elif path.startswith('/api/auth/profile/'):
            student_id = path.split('/')[-1]
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('SELECT id, name, email, gpa, attendance, risk_status FROM students WHERE id=?', (student_id,))
            student = c.fetchone()
            conn.close()
            
            if student:
                self.send_json({
                    "success": True,
                    "profile": {
                        "id": student[0],
                        "name": student[1],
                        "email": student[2],
                        "gpa": student[3],
                        "attendance": student[4],
                        "risk_status": student[5]
                    }
                })
            else:
                self.send_json({"error": "Student not found"}, 404)
        
        elif path.startswith('/api/learning/performance/'):
            parts = path.split('/')
            student_id = parts[-1]
            
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('SELECT marks, attendance, engagement, semester FROM performance WHERE student_id=?', (student_id,))
            performances = c.fetchall()
            conn.close()
            
            self.send_json({
                "success": True,
                "performances": [{"marks": p[0], "attendance": p[1], "engagement": p[2], "semester": p[3]} for p in performances]
            })
        
        elif path == '/api/notifications':
            self.send_json({
                "success": True,
                "notifications": [
                    {"id": 1, "type": "DEADLINE", "message": "Assignment due tomorrow"}
                ]
            })
        
        else:
            self.send_json({"error": "Not found"}, 404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    port = 8080
    host = '0.0.0.0'
    
    server = HTTPServer((host, port), BackendHandler)
    
    print(f"\n{'='*60}")
    print(f"Academic Atelier Backend Started")
    print(f"{'='*60}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Base URL: http://localhost:{port}/api")
    print(f"\nEndpoints:")
    print(f"  POST /api/auth/login              - User login")
    print(f"  POST /api/auth/register           - User registration")
    print(f"  GET  /api/auth/profile/{{id}}     - Get profile")
    print(f"  POST /api/learning/record-performance")
    print(f"  GET  /api/learning/performance/{{id}}")
    print(f"  POST /api/knowledge-base/search")
    print(f"  POST /api/chatbot/message         - Chat (proxies to Groq)")
    print(f"  GET  /api/notifications")
    print(f"  GET  /api/health                  - Health check")
    print(f"\nDatabase: {DB_FILE}")
    print(f"{'='*60}\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
        sys.exit(0)
