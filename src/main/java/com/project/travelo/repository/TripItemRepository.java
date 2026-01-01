package com.project.travelo.repository; // <--- MUST MATCH YOUR FOLDER

import com.project.travelo.model.TripItem; // Import the file from step 1
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripItemRepository extends JpaRepository<TripItem, Long> {
}