package com.project.travelo.service;

import com.project.travelo.model.Category;
import com.project.travelo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository repository;

    public List<Category> getAllActiveCategories() {
        return repository.findByIsActiveTrueOrderByNameAsc();
    }

    public Optional<Category> getCategoryByName(String name) {
        return repository.findByNameAndIsActiveTrue(name);
    }

    public Category createCategory(Category category) {
        return repository.save(category);
    }

    public Category updateCategory(Long id, Category category) {
        category.setId(id);
        return repository.save(category);
    }

    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }
}