package com.project.travelo.application.controllers; // <--- MATCHES YOUR FOLDER

// CORRECT IMPORTS for your project structure
import com.project.travelo.model.TripItem;
import com.project.travelo.repository.TripItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin("http://localhost:3000")
public class TripController {

    @Autowired
    private TripItemRepository tripRepository;

    @PostMapping("/add")
    public TripItem addToTrip(@RequestBody TripItem item) {
        return tripRepository.save(item);
    }

    @GetMapping("/view")
    public List<TripItem> viewTrip() {
        return tripRepository.findAll();
    }
}