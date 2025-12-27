package com.smartbasket.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "market_prices")
public class MarketPrice {
    @Id
    private String id;

    @Indexed
    private String marketItemId;

    private Double price;
    private Double originalPrice; // Original price before discount
    private String currency;
    private Instant timestamp;
    private boolean isPromotion;
}

