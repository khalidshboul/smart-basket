package com.smartbasket.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketComparisonResult {
    private String marketId;
    private String marketName;
    private String marketLogoUrl;
    private Double totalPrice;
    private String currency;
    private boolean allItemsAvailable;
    private List<MarketItemPriceInfo> itemPrices;
    private List<String> missingItems;
    private int availableItemCount;
    private int totalItemCount;
}
