import os
from groq import Groq

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.conversation_history = []
    
    def chat_with_context(self, user_message: str, context: str = "") -> str:
        """
        Send a message to Groq API with context and get a response.
        """
        try:
            # Build system message with context
            system_message = f"""You are an AI Academic Curator for a university learning platform.
            You help students with:
            - Academic queries and course information
            - University policies and rules
            - Study recommendations
            - Deadline reminders
            - General academic guidance

            Context: {context}

            Be concise, helpful, and professional in your responses.
            Do not use markdown formatting such as bold (**), italics (*), or headers (#). Use plain text only."""
            
            # Add user message to history
            self.conversation_history.append({
                "role": "user",
                "content": user_message
            })
            
            # Keep only last 10 messages in history
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]
            
            # Call Groq API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    *self.conversation_history
                ],
                temperature=0.7,
                max_tokens=1024
            )
            
            # Extract response and strip markdown bold/italic
            assistant_message = response.choices[0].message.content.replace('**', '').replace('__', '')
            
            # Add to history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
        
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def get_recommendation(self, student_profile: str, performance_data: str) -> str:
        """
        Generate personalized learning recommendations based on student profile.
        """
        try:
            prompt = f"""Based on the following student profile and performance data, 
            provide 3-5 personalized learning recommendations:
            
            Student Profile: {student_profile}
            Performance Data: {performance_data}
            
            Format your response as a numbered list with brief explanations."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an academic advisor providing personalized learning recommendations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            return f"Error generating recommendations: {str(e)}"
    
    def analyze_text(self, text: str) -> dict:
        """
        Analyze academic text for key concepts and summaries.
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an academic text analyzer. Extract key concepts and provide a brief summary."},
                    {"role": "user", "content": f"Analyze this text:\n\n{text}"}
                ],
                temperature=0.5,
                max_tokens=500
            )
            
            analysis = response.choices[0].message.content
            return {"analysis": analysis, "success": True}
        
        except Exception as e:
            return {"error": str(e), "success": False}

# Create a global instance
groq_service = GroqService()
