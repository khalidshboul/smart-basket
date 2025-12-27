package com.smartbasket.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reference_items")
public class ReferenceItem {
    @Id
    private String id;
    private String name;
    
    // Category reference (new - primary)
    private String categoryId;
    
    // Category name (kept for backward compatibility, denormalized)
    private String category;
    
    private String description;
    
    // Multiple images support (migrated from imageUrl)
    @Builder.Default
    private List<String> images = new ArrayList<>();
    
    // Market availability settings
    @Builder.Default
    private boolean availableInAllMarkets = true;
    
    // Only used when availableInAllMarkets is false
    @Builder.Default
    private List<String> specificMarketIds = new ArrayList<>();
    
    // Denormalized field for fast market lookup
    // Auto-updated when MarketItem is created/deleted
    @Builder.Default
    private List<String> linkedMarketIds = new ArrayList<>();
    
    // Active status
    @Builder.Default
    private boolean active = false;
}

