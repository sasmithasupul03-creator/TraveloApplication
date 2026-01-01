package com.project.travelo.service;

import com.project.travelo.model.Subscriber;
import com.project.travelo.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class SubscriberService {
    @Autowired
    private SubscriberRepository repository;

    public Subscriber subscribe(String email) {
        Optional<Subscriber> existing = repository.findByEmail(email);

        if (existing.isPresent()) {
            Subscriber sub = existing.get();
            if (!sub.isActive()) {
                sub.setActive(true);
                return repository.save(sub);
            }
            throw new RuntimeException("Email already subscribed");
        }

        Subscriber newSub = new Subscriber();
        newSub.setEmail(email);
        newSub.setActive(true);
        return repository.save(newSub);
    }

    public void unsubscribe(String email) {
        Optional<Subscriber> sub = repository.findByEmail(email);
        if (sub.isPresent()) {
            Subscriber subscriber = sub.get();
            subscriber.setActive(false);
            repository.save(subscriber);
        }
    }
}