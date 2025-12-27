package com.smartbasket.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "market_items")
public class MarketItem {
    @Id
    private String id;

    @Indexed
    private String marketId;

    @Indexed
    private String referenceItemId;

    private String name; // Market specific name
    private String brand;
    private String barcode;
    
    // Multiple images support (migrated from imageUrl)
    @Builder.Default
    private List<String> images = new ArrayList<>();
    
    // Denormalized price data (updated when price changes)
    private Double currentPrice;
    private Double originalPrice; // For discount calculation
    private String currency;
    private Boolean isPromotion;
    private Instant lastPriceUpdate;
}

