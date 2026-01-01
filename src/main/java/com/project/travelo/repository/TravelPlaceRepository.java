package com.project.travelo.repository;

import com.project.travelo.model.TravelPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TravelPlaceRepository extends JpaRepository<TravelPlace, Long> {
    List<TravelPlace> findByIsActiveTrueOrderByCreatedAtDesc();
    List<TravelPlace> findByCategoryAndIsActiveTrue(String category);
    List<TravelPlace> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}