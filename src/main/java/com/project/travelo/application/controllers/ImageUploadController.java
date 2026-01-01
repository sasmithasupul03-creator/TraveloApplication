package com.project.travelo.application.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@CrossOrigin("http://localhost:3000")
public class ImageUploadController {

    private static final String UPLOAD_DIR = "D:/travelo/travelo-uploads/";

    @PostMapping("/api/upload")
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "http://localhost:5000/images/" + filename; // Changed to 5000 to match your port
            return Collections.singletonMap("imageUrl", fileUrl);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file");
        }
    }
}
// <--- MAKE SURE THIS CLOSING BRACE IS HERE