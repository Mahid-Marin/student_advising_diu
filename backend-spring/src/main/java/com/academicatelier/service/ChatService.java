package com.academicatelier.service;

import com.academicatelier.model.ChatMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {
    
    private final GroqService groqService;
    private final List<ChatMessage> chatHistory = new ArrayList<>();
    private final WebClient webClient;

    public ChatService(GroqService groqService, WebClient.Builder webClientBuilder) {
        this.groqService = groqService;
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    /**
     * Process user message and get response from Groq AI
     */
    public Mono<ChatMessage> processMessage(String userId, String userMessage) {
        return groqService.getAIResponse(userMessage)
            .map(response -> {
                ChatMessage chatMessage = new ChatMessage();
                chatMessage.setUserId(userId);
                chatMessage.setMessage(userMessage);
                chatMessage.setResponse(response);
                chatMessage.setTimestamp(System.currentTimeMillis());
                
                chatHistory.add(chatMessage);
                return chatMessage;
            });
    }

    /**
     * Get chat history for a user
     */
    public List<ChatMessage> getChatHistory(String userId) {
        return chatHistory.stream()
            .filter(msg -> msg.getUserId().equals(userId))
            .toList();
    }

    /**
     * Clear chat history
     */
    public void clearChatHistory(String userId) {
        chatHistory.removeIf(msg -> msg.getUserId().equals(userId));
    }
}
