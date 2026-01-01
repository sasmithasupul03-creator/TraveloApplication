package com.project.travelo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List; // Import List

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String iconName;
    private String colorGradient;
    private String imageUrl;
    private Integer placeCount = 0;

    @Column(nullable = false)
    private boolean isActive = true;

    // --- NEW CODE ---
    // This tells the database: "If I delete this Category, delete all its Places too."
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Place> places;
}