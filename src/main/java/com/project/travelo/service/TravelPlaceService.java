package com.project.travelo.service;

import com.project.travelo.model.TravelPlace;
import com.project.travelo.repository.TravelPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TravelPlaceService {
    @Autowired
    private TravelPlaceRepository repository;

    public List<TravelPlace> getAllActivePlaces() {
        return repository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<TravelPlace> getPlacesByCategory(String category) {
        return repository.findByCategoryAndIsActiveTrue(category);
    }

    public Optional<TravelPlace> getPlaceById(Long id) {
        return repository.findById(id);
    }

    public TravelPlace createPlace(TravelPlace place) {
        return repository.save(place);
    }

    public TravelPlace updatePlace(Long id, TravelPlace place) {
        place.setId(id);
        return repository.save(place);
    }

    public void deletePlace(Long id) {
        repository.deleteById(id);
    }

    public List<TravelPlace> searchPlaces(String keyword) {
        return repository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword);
    }
}