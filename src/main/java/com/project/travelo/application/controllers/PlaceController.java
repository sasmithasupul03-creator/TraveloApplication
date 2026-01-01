package com.project.travelo.application.controllers;

import com.project.travelo.model.Place;
import com.project.travelo.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@CrossOrigin("http://localhost:3000") // Allows React to connect
public class PlaceController {

    @Autowired
    private PlaceRepository placeRepository;

    // 1. Get All Places
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    // 2. Add New Place
    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        return placeRepository.save(place);
    }

    // 3. Update Existing Place (FIXED)
    @PutMapping("/{id}")
    public Place updatePlace(@PathVariable Long id, @RequestBody Place placeDetails) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place not found with id: " + id));

        // Update standard fields
        place.setName(placeDetails.getName());
        place.setCategory(placeDetails.getCategory());
        place.setDescription(placeDetails.getDescription());
        place.setLocation(placeDetails.getLocation());

        // === UPDATING IMAGES ===
        place.setImage(placeDetails.getImage());

        // THESE WERE MISSING BEFORE:
        place.setImage2(placeDetails.getImage2());
        place.setImage3(placeDetails.getImage3());
        // =======================

        return placeRepository.save(place);
    }

    // 4. Delete Place
    @DeleteMapping("/{id}")
    public void deletePlace(@PathVariable Long id) {
        placeRepository.deleteById(id);
    }
    // ... inside PlaceController class ...

    // 5. Get Single Place by ID (ADD THIS METHOD)
    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place not found with id: " + id));
    }
    // ... other methods ...

    // 6. SEARCH Place by Name (Use this for Trip Plans)
    @GetMapping("/search")
    public Place getPlaceByName(@RequestParam String name) {
        return placeRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Place not found with name: " + name));
    }
}