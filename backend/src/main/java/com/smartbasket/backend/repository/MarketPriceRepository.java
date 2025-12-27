package com.smartbasket.backend.repository;

import com.smartbasket.backend.model.MarketPrice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketPriceRepository extends MongoRepository<MarketPrice, String> {
    List<MarketPrice> findByMarketItemId(String marketItemId);
    // Find latest price for an item (requires sorting in service or complex query)
    List<MarketPrice> findByMarketItemIdOrderByTimestampDesc(String marketItemId);
}
