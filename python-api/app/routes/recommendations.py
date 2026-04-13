from fastapi import APIRouter, HTTPException
from app.services.groq_service import groq_service
from app.routes.models import RecommendationRequest, RecommendationResponse

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized learning recommendations for a student.
    """
    try:
        # Format student profile and performance data
        profile_str = f"""
        Name: {request.student_profile.name}
        Courses: {', '.join(request.student_profile.courses)}
        Current GPA: {request.student_profile.current_gpa}
        Attendance: {request.student_profile.attendance_rate}%
        Major: {request.student_profile.major}
        """
        
        performance_str = f"""
        Marks: {request.performance_data.marks}
        Attendance: {request.performance_data.attendance}%
        Engagement: {request.performance_data.engagement_score}
        Courses Completed: {request.performance_data.courses_completed}
        Semester: {request.performance_data.semester}
        """
        
        # Get recommendations from Groq
        recommendations_text = groq_service.get_recommendation(profile_str, performance_str)
        
        # Parse recommendations (in production, use more sophisticated parsing)
        recommendations = [line.strip() for line in recommendations_text.split('\n') if line.strip() and not line.startswith('#')]
        
        # Identify priority areas based on performance
        priority_areas = []
        if request.performance_data.marks < 60:
            priority_areas.append("Improve academic performance in weak areas")
        if request.performance_data.attendance < 80:
            priority_areas.append("Increase class attendance")
        if request.performance_data.engagement_score < 50:
            priority_areas.append("Increase class participation and engagement")
        
        if not priority_areas:
            priority_areas.append("Maintain current performance level")
        
        return RecommendationResponse(
            recommendations=recommendations[:5],
            priority_areas=priority_areas,
            success=True
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.get("/analyze")
async def analyze_performance(gpa: float, attendance: float, engagement: float):
    """
    Analyze student performance and provide insights.
    """
    try:
        prompt = f"""Analyze this student's performance and provide insights:
        GPA: {gpa}
        Attendance: {attendance}%
        Engagement: {engagement}
        
        Provide 2-3 specific, actionable insights."""
        
        response = groq_service.chat_with_context(prompt)
        return {"analysis": response, "success": True}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
