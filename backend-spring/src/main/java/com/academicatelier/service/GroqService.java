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
