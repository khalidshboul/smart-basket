package com.smartbasket.backend.repository;

import com.smartbasket.backend.model.MarketItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketItemRepository extends MongoRepository<MarketItem, String> {
    List<MarketItem> findByReferenceItemId(String referenceItemId);
    List<MarketItem> findByMarketId(String marketId);
}
