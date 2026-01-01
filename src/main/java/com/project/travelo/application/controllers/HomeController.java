package com.project.travelo.application.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> map = new HashMap<>();
        map.put("message", "TravelO API");
        map.put("version", "1.0.0");
        return map;
    }
}