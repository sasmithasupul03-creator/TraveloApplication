package com.project.travelo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // --- CHANGED CODE ---
    // Instead of String, we link to the Category object.
    // @JsonIgnore prevents infinite loops when sending data to frontend
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private Category category;
    // --------------------

    private String location;

    @Column(length = 1000)
    private String description;

    private String image;
    private String image2;
    private String image3;

    // Updated Constructor: Note that 'category' is now the Object, not a String
    public Place(String name, Category category, String location, String description, String image, String image2, String image3) {
        this.name = name;
        this.category = category;
        this.location = location;
        this.description = description;
        this.image = image;
        this.image2 = image2;
        this.image3 = image3;
    }
}