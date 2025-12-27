package com.smartbasket.backend.service;

import com.smartbasket.backend.dto.BatchPriceUpdateRequest;
import com.smartbasket.backend.dto.BatchPriceUpdateResponse;
import com.smartbasket.backend.model.MarketItem;
import com.smartbasket.backend.model.MarketPrice;
import com.smartbasket.backend.repository.MarketItemRepository;
import com.smartbasket.backend.repository.MarketPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PriceUpdateService {

    private final MarketItemRepository marketItemRepository;
    private final MarketPriceRepository marketPriceRepository;

    private static final String DEFAULT_CURRENCY = "JOD";

    /**
     * Update a single item's price
     */
    @Transactional
    public MarketPrice updatePrice(String marketItemId, Double price, Double originalPrice, String currency, Boolean isPromotion) {
        Optional<MarketItem> optItem = marketItemRepository.findById(marketItemId);
        if (optItem.isEmpty()) {
            throw new IllegalArgumentException("Market item not found: " + marketItemId);
        }

        MarketItem marketItem = optItem.get();
        String effectiveCurrency = currency != null ? currency : DEFAULT_CURRENCY;
        boolean effectivePromotion = isPromotion != null ? isPromotion : false;
        Instant now = Instant.now();

        // 1. Create price history record
        MarketPrice priceRecord = MarketPrice.builder()
                .marketItemId(marketItemId)
                .price(price)
                .originalPrice(originalPrice)
                .currency(effectiveCurrency)
                .isPromotion(effectivePromotion)
                .timestamp(now)
                .build();
        MarketPrice savedPrice = marketPriceRepository.save(priceRecord);

        // 2. Update cached price on MarketItem
        marketItem.setCurrentPrice(price);
        marketItem.setOriginalPrice(originalPrice);
        marketItem.setCurrency(effectiveCurrency);
        marketItem.setIsPromotion(effectivePromotion);
        marketItem.setLastPriceUpdate(now);
        marketItemRepository.save(marketItem);

        return savedPrice;
    }

    /**
     * Batch update prices for multiple items
     */
    @Transactional
    public BatchPriceUpdateResponse batchUpdatePrices(BatchPriceUpdateRequest request) {
        List<BatchPriceUpdateResponse.PriceUpdateResult> results = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;

        for (BatchPriceUpdateRequest.PriceEntry entry : request.getPrices()) {
            try {
                updatePrice(
                        entry.getMarketItemId(),
                        entry.getPrice(),
                        entry.getOriginalPrice(),
                        entry.getCurrency(),
                        entry.getIsPromotion()
                );
                results.add(BatchPriceUpdateResponse.PriceUpdateResult.builder()
                        .marketItemId(entry.getMarketItemId())
                        .success(true)
                        .message("Price updated successfully")
                        .newPrice(entry.getPrice())
                        .build());
                successCount++;
            } catch (Exception e) {
                results.add(BatchPriceUpdateResponse.PriceUpdateResult.builder()
                        .marketItemId(entry.getMarketItemId())
                        .success(false)
                        .message(e.getMessage())
                        .build());
                failureCount++;
            }
        }

        return BatchPriceUpdateResponse.builder()
                .totalRequested(request.getPrices().size())
                .successCount(successCount)
                .failureCount(failureCount)
                .results(results)
                .build();
    }

    /**
     * Get price history for a market item
     */
    public List<MarketPrice> getPriceHistory(String marketItemId) {
        return marketPriceRepository.findByMarketItemIdOrderByTimestampDesc(marketItemId);
    }
}
