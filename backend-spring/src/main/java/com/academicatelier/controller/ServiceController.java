package com.academicatelier.controller;

import com.academicatelier.service.GroqService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
public class ServiceController {
    
    private final GroqService groqService;

    public ServiceController(GroqService groqService) {
        this.groqService = groqService;
    }

    /**
     * SECTION 3: Services Endpoints
     * GET /api/services/health - Check Groq AI service status
     */
    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> checkServiceHealth() {
        return groqService.healthCheck()
            .map(isHealthy -> {
                Map<String, Object> response = new HashMap<>();
                response.put("status", isHealthy ? "healthy" : "unhealthy");
                response.put("groqService", isHealthy);
                response.put("timestamp", System.currentTimeMillis());
                return ResponseEntity.ok(response);
            })
            .onErrorReturn(ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Service health check failed"
            )));
    }

    /**
     * Get system information
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> getSystemInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("service", "Academic Atelier Backend");
        info.put("version", "1.0.0");
        info.put("framework", "Spring Boot");
        info.put("java_version", System.getProperty("java.version"));
        return ResponseEntity.ok(info);
    }

    /**
     * Check Groq AI API connectivity
     */
    @PostMapping("/groq/test")
    public Mono<ResponseEntity<Map<String, String>>> testGroqConnection(
            @RequestBody Map<String, String> request) {
        
        String testMessage = request.getOrDefault("message", "Hello, can you confirm you're working?");
        
        return groqService.getAIResponse(testMessage)
            .map(response -> {
                Map<String, String> result = new HashMap<>();
                result.put("status", "connected");
                result.put("response", response);
                return ResponseEntity.ok(result);
            })
            .onErrorReturn(ResponseEntity.status(500).body(Map.of(
                "status", "disconnected",
                "error", "Unable to connect to Groq API"
            )));
    }
}
