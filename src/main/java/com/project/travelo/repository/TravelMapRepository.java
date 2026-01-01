package com.project.travelo.repository;

import com.project.travelo.model.TravelMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TravelMapRepository extends JpaRepository<TravelMap, Long> {
    List<TravelMap> findByIsActiveTrueOrderByMapIdAsc();
    Optional<TravelMap> findByMapIdAndIsActiveTrue(Integer mapId);
}