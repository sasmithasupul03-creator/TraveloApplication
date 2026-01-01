package com.project.travelo.service;

import com.project.travelo.model.TravelMap;
import com.project.travelo.repository.TravelMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TravelMapService {
    @Autowired
    private TravelMapRepository repository;

    public List<TravelMap> getAllActiveMaps() {
        return repository.findByIsActiveTrueOrderByMapIdAsc();
    }

    public Optional<TravelMap> getMapById(Integer mapId) {
        return repository.findByMapIdAndIsActiveTrue(mapId);
    }

    public TravelMap createMap(TravelMap map) {
        return repository.save(map);
    }

    public TravelMap updateMap(Long id, TravelMap map) {
        map.setId(id);
        return repository.save(map);
    }

    public void deleteMap(Long id) {
        repository.deleteById(id);
    }
}