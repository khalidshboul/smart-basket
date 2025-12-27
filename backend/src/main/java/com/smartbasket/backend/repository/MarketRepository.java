package com.smartbasket.backend.repository;

import com.smartbasket.backend.model.Market;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketRepository extends MongoRepository<Market, String> {
    List<Market> findByActiveTrue();
}
