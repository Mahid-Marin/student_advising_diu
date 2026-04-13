package com.academicatelier.controller;

import com.academicatelier.model.ChatMessage;
import com.academicatelier.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
public class ChatController {
    
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * SECTION 1: Chat Endpoints
     * POST /api/chat/send - Send a message and get AI response
     */
    @PostMapping("/send")
    public Mono<ResponseEntity<ChatMessage>> sendMessage(
            @RequestParam String userId,
            @RequestBody Map<String, String> request) {
        
        String message = request.get("message");
        
        return chatService.processMessage(userId, message)
            .map(ResponseEntity::ok)
            .onErrorReturn(ResponseEntity.status(500).build());
    }

    /**
     * Get chat history for a user
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String userId) {
        List<ChatMessage> history = chatService.getChatHistory(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Clear chat history for a user
     */
    @DeleteMapping("/history/{userId}")
    public ResponseEntity<Map<String, String>> clearChatHistory(@PathVariable String userId) {
        chatService.clearChatHistory(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Chat history cleared");
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Chat service is running");
        return ResponseEntity.ok(response);
    }
}
