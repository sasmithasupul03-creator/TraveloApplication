package com.project.travelo.application.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {
    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> map = new HashMap<>();
        map.put("status", "running");
        map.put("message", "TravelO Backend");
        return map;
    }
}