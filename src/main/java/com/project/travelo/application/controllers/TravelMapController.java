package com.project.travelo.application.controllers;

import com.project.travelo.model.TravelMap;
import com.project.travelo.service.TravelMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map; // This is now safe to import because we renamed our model!

@RestController
@RequestMapping("/api/maps")
@CrossOrigin(origins = "http://localhost:3000")
public class TravelMapController {

    @Autowired
    private TravelMapService service;

    @GetMapping
    public ResponseEntity<List<TravelMap>> getAllMaps() {
        return ResponseEntity.ok(service.getAllActiveMaps());
    }

    @GetMapping("/{mapId}")
    public ResponseEntity<TravelMap> getMapById(@PathVariable Integer mapId) {
        return service.getMapById(mapId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createMap(@RequestBody TravelMap map) {
        try {
            TravelMap createdMap = service.createMap(map);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Map created successfully");
            response.put("map", createdMap);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}