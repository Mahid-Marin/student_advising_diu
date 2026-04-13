from dotenv import load_dotenv
load_dotenv()  # Must run before any app imports that read env vars

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routes import chat, recommendations

app = FastAPI(
    title="Academic Atelier AI API",
    description="AI-powered learning and support API",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(recommendations.router, prefix="/recommend", tags=["Recommendations"])

@app.get("/")
async def root():
    return {"message": "Academic Atelier AI API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
