package com.project.travelo.application.controllers;

import com.project.travelo.service.SubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/subscribe")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscribeController {

    @Autowired
    private SubscriberService service;

    @PostMapping
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            service.subscribe(email);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Successfully subscribed!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // FIXED: Changed from @PathVariable to @RequestParam to handle email dots (e.g., .com) correctly
    @DeleteMapping
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestParam String email) {
        try {
            service.unsubscribe(email);
            return ResponseEntity.ok(Map.of("message", "Successfully unsubscribed"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error unsubscribing"));
        }
    }
}