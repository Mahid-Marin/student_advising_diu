package com.academicatelier.service;

import com.academicatelier.model.Recommendation;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {
    
    private final GroqService groqService;
    private final List<Recommendation> recommendations = new ArrayList<>();

    public RecommendationService(GroqService groqService) {
        this.groqService = groqService;
    }

    /**
     * Get course recommendations based on student profile
     */
    public Mono<List<Recommendation>> getRecommendations(String userId, String studentInfo) {
        String prompt = "Based on the following student information, recommend 5 courses: " + studentInfo;
        
        return groqService.getAIResponse(prompt)
            .map(response -> generateRecommendations(userId, response));
    }

    /**
     * Get learning paths based on goals
     */
    public Mono<List<Recommendation>> getLearningPath(String userId, String goal) {
        String prompt = "Create a structured learning path for: " + goal;
        
        return groqService.getAIResponse(prompt)
            .map(response -> generateLearningPath(userId, response));
    }

    /**
     * Get knowledge base articles
     */
    public List<Recommendation> getKnowledgeBase(String topic) {
        return recommendations.stream()
            .filter(rec -> rec.getCourseName().toLowerCase().contains(topic.toLowerCase()))
            .toList();
    }

    /**
     * Save a recommendation
     */
    public Recommendation saveRecommendation(Recommendation recommendation) {
        recommendation.setId((long) (recommendations.size() + 1));
        recommendations.add(recommendation);
        return recommendation;
    }

    private List<Recommendation> generateRecommendations(String userId, String response) {
        List<Recommendation> recs = new ArrayList<>();
        String[] courses = response.split("\n");
        
        for (int i = 0; i < Math.min(courses.length, 5); i++) {
            Recommendation rec = new Recommendation();
            rec.setId((long) (i + 1));
            rec.setUserId(userId);
            rec.setCourseName(courses[i].trim());
            rec.setConfidence(0.85 + (i * 0.03));
            recs.add(rec);
        }
        
        return recs;
    }

    private List<Recommendation> generateLearningPath(String userId, String response) {
        List<Recommendation> path = new ArrayList<>();
        String[] steps = response.split("\n");
        
        for (int i = 0; i < steps.length; i++) {
            Recommendation step = new Recommendation();
            step.setId((long) (i + 1));
            step.setUserId(userId);
            step.setDescription(steps[i].trim());
            step.setConfidence(1.0);
            path.add(step);
        }
        
        return path;
    }
}
