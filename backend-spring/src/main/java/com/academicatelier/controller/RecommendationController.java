package com.academicatelier.controller;

import com.academicatelier.model.Recommendation;
import com.academicatelier.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
public class RecommendationController {
    
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * SECTION 2: Recommendations & Models Endpoints
     * GET /api/recommendations - Get course recommendations
     */
    @PostMapping("")
    public Mono<ResponseEntity<List<Recommendation>>> getRecommendations(
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        String studentInfo = request.get("studentInfo");
        
        return recommendationService.getRecommendations(userId, studentInfo)
            .map(ResponseEntity::ok)
            .onErrorReturn(ResponseEntity.status(500).build());
    }

    /**
     * Get learning path based on goal
     */
    @PostMapping("/learning-path")
    public Mono<ResponseEntity<List<Recommendation>>> getLearningPath(
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        String goal = request.get("goal");
        
        return recommendationService.getLearningPath(userId, goal)
            .map(ResponseEntity::ok)
            .onErrorReturn(ResponseEntity.status(500).build());
    }

    /**
     * Get knowledge base articles by topic
     */
    @GetMapping("/knowledge-base")
    public ResponseEntity<List<Recommendation>> getKnowledgeBase(
            @RequestParam String topic) {
        
        List<Recommendation> knowledgeBase = recommendationService.getKnowledgeBase(topic);
        return ResponseEntity.ok(knowledgeBase);
    }

    /**
     * Save a recommendation
     */
    @PostMapping("/save")
    public ResponseEntity<Recommendation> saveRecommendation(
            @RequestBody Recommendation recommendation) {
        
        Recommendation saved = recommendationService.saveRecommendation(recommendation);
        return ResponseEntity.ok(saved);
    }

    /**
     * Dashboard metrics
     */
    @GetMapping("/metrics/{userId}")
    public ResponseEntity<Map<String, Object>> getMetrics(@PathVariable String userId) {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("userId", userId);
        metrics.put("totalRecommendations", 0);
        metrics.put("completedCourses", 0);
        metrics.put("learningProgress", 0.0);
        return ResponseEntity.ok(metrics);
    }
}
