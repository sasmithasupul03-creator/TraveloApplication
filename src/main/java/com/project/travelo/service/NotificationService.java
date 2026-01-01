package com.project.travelo.service;

import com.project.travelo.model.Notification;
import com.project.travelo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository repository;

    public List<Notification> getAllActiveNotifications() {
        return repository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public Notification createNotification(Notification notification) {
        return repository.save(notification);
    }

    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}