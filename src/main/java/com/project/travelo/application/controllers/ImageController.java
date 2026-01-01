package com.project.travelo.application.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    // CHANGE THIS to match the folder you created
    private static final String UPLOAD_DIR = "D:/travelo/travelo-uploads/";

    @PostMapping("/api/travelo-upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Generate a unique name for the file (so duplicates don't overwrite)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // 2. Save the file to the folder
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 3. Return the URL so React can show it
            // URL format: http://localhost:5000/images/filename.jpg
            String fileUrl = "http://localhost:5000/images/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload image"));
        }
    }
}