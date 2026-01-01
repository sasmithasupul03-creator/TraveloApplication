package com.project.travelo.repository;

import com.project.travelo.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // <--- Import this

public interface PlaceRepository extends JpaRepository<Place, Long> {
    // Add this line to find places by name!
    Optional<Place> findByName(String name);
}