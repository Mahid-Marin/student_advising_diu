# Academic Atelier - Student Advising System

An AI-powered student advising system built with **Java 25**, **Spring Boot 4.0**, and **React with Vite**.

## 🚀 Quick Start

### Prerequisites
- Java 25 (Oracle JDK)
- Node.js 18+
- Maven 3.9+

### Running Locally

#### 1. **Backend (Spring Boot)**
```powershell
cd backend-spring
java -jar target/academic-atelier-backend-1.0.0.jar
```
Runs on: `http://localhost:8080/api`

#### 2. **Frontend (React + Vite)**
```powershell
cd frontend
npm install
npm run dev
```
Runs on: `http://localhost:3000` or `http://localhost:3001`

#### 3. **Access the Application**
Open your browser and navigate to:
```
http://localhost:3000
```
or
```
http://localhost:3001
```

### Demo Login Credentials
```
Email: john@example.com
Password: password123
```

## 🔧 Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/keys

## 📁 Project Structure

```
academic-atelier/
├── backend-spring/          # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/academicatelier/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── model/       # Data models
│   │       └── config/      # Spring configs
│   └── pom.xml
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, etc.
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API client
│   │   └── context/        # Zustand stores
│   └── package.json
└── python-api/              # Python backend (optional)
```

## 🔐 Authentication Flow

1. User enters credentials on `/login` page
2. Frontend sends POST request to `POST /api/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>` header
6. Protected routes redirect to login if no valid token

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | Java | 25 LTS |
| Framework | Spring Boot | 4.0.0 |
| Frontend | React | 18.2 |
| Build Tool | Vite | 5.0 |
| State Management | Zustand | 4.4 |
| HTTP Client | Axios | 1.6 |
| Styling | Tailwind CSS | 3.3 |
| Database | H2 (Dev) | - |
| AI API | Groq | Mixtral-8x7b |

## 🐛 Troubleshooting

### "Login Failed" Error

**Check the console (F12) for detailed error message:**

1. Open browser DevTools (`F12`)
2. Go to **Console** tab
3. Try logging in again
4. Look for error responses

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Cannot connect to API | Ensure backend is running on port 8080 |
| CORS errors | Backend has CORS enabled for localhost:3000 and 3001 |
| Token not saving | Check if localStorage is enabled in browser |
| Blank page after login | Check if `@react/router-dom` is imported correctly |

### Test API Directly

```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body -UseBasicParsing
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile/{studentId}` - Get profile
- `PUT /api/auth/profile/{studentId}` - Update profile
- `POST /api/auth/logout` - Logout

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history/{studentId}` - Get chat history

### Recommendations
- `GET /api/recommendations/{studentId}` - Get course recommendations

### Services
- `GET /api/services/health` - Health check

## 🌐 GitHub Repository

https://github.com/Mahid-Marin/student_advising_diu

## 📄 License

MIT

---

**Happy Studying! 🎓**
