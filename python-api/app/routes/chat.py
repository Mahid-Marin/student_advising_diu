from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from app.services.groq_service import groq_service
from app.routes.models import ChatMessage, ChatResponse

router = APIRouter()

# Store sessions (in production, use database)
sessions = {}

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """
    Send a message to the AI chatbot and get a response.
    """
    try:
        # Generate or retrieve session ID
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get AI response from Groq
        ai_response = groq_service.chat_with_context(
            user_message=request.message,
            context=request.context
        )
        
        # Determine if escalation is needed
        escalation_keywords = ["emergency", "urgent", "help", "serious", "crisis"]
        needs_escalation = any(keyword in request.message.lower() for keyword in escalation_keywords)
        
        # Create response
        response = ChatResponse(
            response=ai_response,
            session_id=session_id,
            timestamp=datetime.now().isoformat(),
            needs_escalation=needs_escalation
        )
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """
    Retrieve chat session history.
    """
    try:
        if session_id in sessions:
            return {"session_id": session_id, "messages": sessions[session_id]}
        return {"session_id": session_id, "messages": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
