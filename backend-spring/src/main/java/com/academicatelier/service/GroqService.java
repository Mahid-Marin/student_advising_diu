package com.academicatelier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class GroqService {
    
    private final WebClient webClient;
    
    @Value("${groq.api.key}")
    private String groqApiKey;
    
    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    public GroqService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Get AI response from Groq API
     */
    public Mono<String> getAIResponse(String prompt) {
        // If API key is not configured, return mock response
        if (groqApiKey == null || groqApiKey.trim().isEmpty()) {
            return Mono.just(getMockResponse(prompt));
        }
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mixtral-8x7b-32768");
        requestBody.put("messages", new Object[]{
            new HashMap<String, String>() {{
                put("role", "user");
                put("content", prompt);
            }}
        });
        requestBody.put("max_tokens", 512);
        requestBody.put("temperature", 0.7);

        return webClient.post()
            .uri(groqApiUrl)
            .header("Authorization", "Bearer " + groqApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> extractMessageContent(response))
            .onErrorReturn("I'm unable to process your request at the moment. Please try again later.")
            .doOnError(error -> System.err.println("Groq API Error: " + error.getMessage()));
    }

    /**
     * Provide mock AI responses for demo purposes
     */
    private String getMockResponse(String prompt) {
        String lowerPrompt = prompt.toLowerCase();
        
        // Course & Class Recommendations
        if (lowerPrompt.contains("course") || lowerPrompt.contains("class") || 
            lowerPrompt.contains("what should i take") || lowerPrompt.contains("recommend")) {
            return "Based on your Computer Science major, I recommend:\n\n1. **Advanced Data Structures** - Essential for interviews and advanced CS concepts\n2. **Database Systems** - Fundamental for backend development\n3. **Web Development** - Highly marketable skill, great for internships\n4. **Software Engineering** - Teaches team collaboration and project management\n\nFocus on these in your next semester!";
        } 
        // Major & Program
        else if (lowerPrompt.contains("major") || lowerPrompt.contains("program") || 
                 lowerPrompt.contains("should i choose") || lowerPrompt.contains("best major")) {
            return "Computer Science is an excellent choice! Here's why:\n\n✅ **Career Prospects**: High demand, excellent salary\n✅ **Flexibility**: Opens doors to many fields (AI, Web, Mobile, Cloud)\n✅ **Growth**: Tech industry is booming\n\nI'd suggest focusing on:\n- Core fundamentals (DSA, OOP, Databases)\n- One specialization (Web/Mobile/AI)\n- Build projects for your portfolio";
        } 
        // Grades & Academic Performance
        else if (lowerPrompt.contains("grade") || lowerPrompt.contains("improve") || 
                 lowerPrompt.contains("struggling") || lowerPrompt.contains("gpa")) {
            return "Here's my advice to improve your grades:\n\n📚 **Study Strategies:**\n1. **Active Learning** - Don't just read, solve practice problems\n2. **Group Study** - Teach others to solidify your understanding\n3. **Office Hours** - Get 1-on-1 help from professors\n4. **Spaced Repetition** - Review material regularly, not just before exams\n\n⏰ **Time Management:**\n- Start assignments early\n- Break tasks into smaller chunks\n- Set realistic daily goals\n\nYou've got this! 💪";
        } 
        // Projects & Assignments
        else if (lowerPrompt.contains("project") || lowerPrompt.contains("assignment") || 
                 lowerPrompt.contains("how do i") || lowerPrompt.contains("help with")) {
            return "Here's my project/assignment advice:\n\n🎯 **Project Planning:**\n1. Understand requirements fully before coding\n2. Break it into smaller tasks/milestones\n3. Set interim deadlines (don't do everything last minute)\n4. Test frequently as you build\n\n💡 **Problem-Solving:**\n- Google is your friend (most developers do this!)\n- Check Stack Overflow for similar issues\n- Ask TAs in office hours\n- Collaborate with classmates (but don't copy)\n\n📝 **Documentation:**\n- Comment your code\n- Write clear README files\n- This impresses professors!\n\nStart early, and you'll crush it!";
        } 
        // Internships & Career
        else if (lowerPrompt.contains("internship") || lowerPrompt.contains("job") || 
                 lowerPrompt.contains("career") || lowerPrompt.contains("interview")) {
            return "Great question about your career! Here's my roadmap:\n\n🎓 **Before Internships:**\n- Build 2-3 strong projects for your portfolio\n- Master DSA (crucial for tech interviews)\n- Practice on LeetCode/HackerRank\n- Network at tech meetups\n\n🏢 **Landing Internships:**\n- Apply to 20+ companies (acceptance rate ~20%)\n- Customize resume/cover letter\n- Practice behavioral + technical questions\n- Reach out to alumni at companies\n\n💼 **During Internship:**\n- Take on challenging projects\n- Build relationships with mentors\n- Document what you learned\n- Follow up for full-time offers\n\nStart building your portfolio now!";
        } 
        // Study Tips & Time Management
        else if (lowerPrompt.contains("study") || lowerPrompt.contains("exam") || 
                 lowerPrompt.contains("test") || lowerPrompt.contains("prepare")) {
            return "Exam preparation strategy:\n\n📅 **Create a Timeline:**\n- 4 weeks before: Start reviewing material\n- 2 weeks before: Deep dive into problem areas\n- 1 week before: Practice full exams\n- 3 days before: Light review, rest well\n\n📖 **Study Methods:**\n- Make concept maps (visual learning)\n- Create flashcards for definitions\n- Solve old exams under timed conditions\n- Teach concepts to a friend\n\n😴 **Health Matters:**\n- Sleep 7-8 hours (your brain consolidates memories while sleeping)\n- Exercise 30 mins daily (reduces stress)\n- Eat healthy (brain fuel!)\n- Take breaks every 50 minutes\n\nConsistency beats cramming every time!";
        } 
        // GPA & Academic Standing
        else if (lowerPrompt.contains("gpa") || lowerPrompt.contains("average") || 
                 lowerPrompt.contains("academic standing") || lowerPrompt.contains("probation")) {
            return "Let me help you improve your GPA:\n\n📊 **Current Situation:**\nYour GPA is important but not everything. Many successful people didn't have perfect GPAs.\n\n🎯 **Action Plan:**\n1. **Identify weak courses** - Which are dragging you down?\n2. **Get support early** - Don't wait until you're failing\n3. **Quality > Quantity** - Better to do well in fewer classes\n4. **Retake if allowed** - Some schools let you retake for better grades\n\n💪 **Quick Wins:**\n- Attend every class (seriously!)\n- Participate in discussions\n- Complete all homework\n- Visit tutoring center\n\nYou can turn this around! One semester of hard work can make a big difference.";
        } 
        // Schedule & Course Selection
        else if (lowerPrompt.contains("schedule") || lowerPrompt.contains("semester") || 
                 lowerPrompt.contains("next") || lowerPrompt.contains("planning")) {
            return "Course planning for next semester:\n\n📚 **Balanced Schedule:**\n- Mix hard and easy courses (don't stack all difficult ones)\n- Balance theory-heavy with project-based courses\n- Consider prerequisites carefully\n- Leave room for electives you enjoy\n\n🎯 **My Recommendation (CS Major):**\n- 1-2 core CS courses (Data Structures, Algorithms)\n- 1 Systems course (Database, Operating Systems)\n- 1 Project course (Web Dev, Mobile)\n- 1 Humanities/Gen-Ed\n- Total: 12-15 credit hours is good\n\n⏰ **Schedule Tips:**\n- Morning classes = better focus\n- Avoid back-to-back classes if possible\n- Check professor reviews on RateMyProfessor\n- Early registration helps get better times\n\nLet me know what specific courses you're considering!";
        } 
        // Scholarships & Financial Aid
        else if (lowerPrompt.contains("scholarship") || lowerPrompt.contains("financial") || 
                 lowerPrompt.contains("financial aid") || lowerPrompt.contains("tuition")) {
            return "Financial aid and scholarships:\n\n💰 **Scholarships to Apply For:**\n1. Merit-based (GPA, test scores)\n2. Department-specific (CS scholarships are common)\n3. Diversity scholarships\n4. Community scholarships\n5. Employer scholarships\n\n📝 **Application Tips:**\n- Apply early (deadline matters!)\n- Write honest, compelling essays\n- Highlight leadership & volunteering\n- Get strong recommendation letters\n- Apply to 10+ scholarships (increase odds)\n\n🏦 **Other Funding:**\n- Federal Student Aid (FAFSA) - Free money for eligible students\n- Work-study programs on campus\n- TA/RA positions (paid + tuition help)\n- Part-time coding jobs\n\nDon't leave free money on the table!";
        } 
        // Networking & Clubs
        else if (lowerPrompt.contains("club") || lowerPrompt.contains("network") || 
                 lowerPrompt.contains("join") || lowerPrompt.contains("community")) {
            return "Getting involved on campus:\n\n🤝 **Why Join Clubs?**\n- Build network for future jobs\n- Learn practical skills outside classroom\n- Have fun with like-minded people\n- Leadership experience for resume\n\n💻 **Recommended for CS Students:**\n1. **Coding Clubs** - Local hackathons, coding competitions\n2. **Open Source** - Contribute to real-world projects\n3. **Tech Meetups** - Connect with industry professionals\n4. **Case competitions** - Real business problems\n5. **Mentorship programs** - Learn from upper-level students\n\n🌟 **Pro Tips:**\n- Start with 1-2 clubs (don't overcommit)\n- Aim for leadership positions\n- Document your contributions\n- Use projects from clubs on your portfolio\n\nNetworking is how you find jobs before they're posted!";
        } 
        // Stress & Mental Health
        else if (lowerPrompt.contains("stress") || lowerPrompt.contains("anxiety") || 
                 lowerPrompt.contains("overwhelm") || lowerPrompt.contains("mental health")) {
            return "Taking care of yourself is important:\n\n🧠 **Mental Health Resources:**\n- Campus counseling (usually free!)\n- Peer support groups\n- Academic advisors can help with workload\n- Religious/spiritual centers\n\n💪 **Stress Management:**\n1. **Exercise** - Gym, yoga, or just walks (15 mins = mental clarity)\n2. **Sleep** - Non-negotiable (7-8 hours needed)\n3. **Social** - Hang with friends, laugh, have fun\n4. **Hobbies** - Do things you enjoy outside academics\n5. **Organize** - Planning reduces anxiety\n\n📞 **When to Get Help:**\n- If stress affects sleep/eating\n- If you're constantly anxious\n- If you have thoughts of self-harm\n\nSeek help immediately from campus health services.\n\nRemember: Your mental health > Your GPA. Always.";
        } 
        // Study Groups & Tutoring
        else if (lowerPrompt.contains("study group") || lowerPrompt.contains("tutor") || 
                 lowerPrompt.contains("help") || lowerPrompt.contains("struggling")) {
            return "Getting academic help:\n\n👥 **Study Groups:**\n- Form groups of 3-4 people\n- Meet 2-3 times per week\n- **Best practices:**\n  - Everyone prepares beforehand\n  - Rotate who leads discussion\n  - Solve problems together\n  - Teach each other (best learning method!)\n\n📚 **Tutoring:**\n- Check campus tutoring center (often free!)\n- One-on-one sessions for tough subjects\n- Group sessions for general review\n- Online tutors if needed\n\n💻 **Online Resources:**\n- Khan Academy (videos for fundamentals)\n- Coursera (free courses)\n- YouTube channels (channel-dependent quality)\n- Office hours with professor\n\n🎯 **Effective Help:**\n- Identify exactly what you don't understand\n- Ask specific questions\n- work through examples\n- Practice on your own after\n\nDon't wait until you're falling behind!";
        } else {
            return "That's a great question! I'm getting smarter every day, but if you could ask about:\n\n📚 **Courses & Learning** - Course recommendations, study tips\n💼 **Career** - Internships, interviews, job search\n📊 **Academics** - GPA, grades, exams, schedules\n💰 **Finances** - Scholarships, financial aid\n🤝 **Getting Involved** - Clubs, networking, community\n🧠 **Well-being** - Stress, mental health, balance\n\nI can give you specific, detailed advice! What would help you most right now?";
        }
    }

    /**
     * Extract message content from Groq API response
     */
    @SuppressWarnings("unchecked")
    private String extractMessageContent(Map<String, Object> response) {
        try {
            if (response.containsKey("choices")) {
                java.util.List<Map<String, Object>> choices = 
                    (java.util.List<Map<String, Object>>) response.get("choices");
                
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing Groq response: " + e.getMessage());
        }
        
        return "Unable to generate response";
    }

    /**
     * Health check for Groq service
     */
    public Mono<Boolean> healthCheck() {
        return Mono.just(true);
    }
}
