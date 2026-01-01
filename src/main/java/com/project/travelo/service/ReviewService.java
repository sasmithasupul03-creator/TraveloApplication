package com.project.travelo.service;

import com.project.travelo.model.Review;
import com.project.travelo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository repository;

    public List<Review> getAllApprovedReviews() {
        return repository.findByIsApprovedTrueOrderByCreatedAtDesc();
    }

    public Optional<Review> getReviewById(Long id) {
        return repository.findById(id);
    }

    public Review createReview(Review review) {
        return repository.save(review);
    }

    public Review approveReview(Long id) {
        Optional<Review> reviewOpt = repository.findById(id);
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            review.setApproved(true);
            return repository.save(review);
        }
        return null;
    }

    public void deleteReview(Long id) {
        repository.deleteById(id);
    }
}