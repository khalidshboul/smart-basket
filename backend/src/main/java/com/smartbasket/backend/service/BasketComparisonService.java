package com.smartbasket.backend.service;

import com.smartbasket.backend.dto.*;
import com.smartbasket.backend.model.Market;
import com.smartbasket.backend.model.MarketItem;
import com.smartbasket.backend.model.MarketPrice;
import com.smartbasket.backend.model.ReferenceItem;
import com.smartbasket.backend.repository.MarketItemRepository;
import com.smartbasket.backend.repository.MarketPriceRepository;
import com.smartbasket.backend.repository.MarketRepository;
import com.smartbasket.backend.repository.ReferenceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BasketComparisonService {

    private final ReferenceItemRepository referenceItemRepository;
    private final MarketRepository marketRepository;
    private final MarketItemRepository marketItemRepository;
    private final MarketPriceRepository marketPriceRepository;

    private static final String DEFAULT_CURRENCY = "JOD";

    public BasketComparisonResponse compareBasket(BasketComparisonRequest request) {
        // 1. Get all ACTIVE reference items in the basket
        List<ReferenceItem> basketReferenceItems = referenceItemRepository
                .findAllById(request.getReferenceItemIds())
                .stream()
                .filter(ReferenceItem::isActive) // Exclude inactive items
                .toList();

        // Build basket item info list
        List<BasketItemInfo> basketItemInfos = basketReferenceItems.stream()
                .map(item -> BasketItemInfo.builder()
                        .referenceItemId(item.getId())
                        .name(item.getName())
                        .category(item.getCategory())
                        .build())
                .collect(Collectors.toList());

        // 2. Get all active markets
        List<Market> activeMarkets = marketRepository.findByActiveTrue();

        // 3. For each market, calculate the basket total
        List<MarketComparisonResult> marketResults = new ArrayList<>();

        for (Market market : activeMarkets) {
            MarketComparisonResult result = calculateMarketTotal(market, basketReferenceItems);
            marketResults.add(result);
        }

        // 4. Sort by total price (cheapest first), putting markets with missing items last
        marketResults.sort((a, b) -> {
            // Markets with all items available come first
            if (a.isAllItemsAvailable() && !b.isAllItemsAvailable()) return -1;
            if (!a.isAllItemsAvailable() && b.isAllItemsAvailable()) return 1;
            // Then sort by price
            return Double.compare(a.getTotalPrice(), b.getTotalPrice());
        });

        // 5. Calculate savings and find cheapest
        Double lowestTotal = marketResults.stream()
                .filter(MarketComparisonResult::isAllItemsAvailable)
                .mapToDouble(MarketComparisonResult::getTotalPrice)
                .min()
                .orElse(0.0);

        Double highestTotal = marketResults.stream()
                .filter(MarketComparisonResult::isAllItemsAvailable)
                .mapToDouble(MarketComparisonResult::getTotalPrice)
                .max()
                .orElse(0.0);

        MarketComparisonResult cheapest = marketResults.stream()
                .filter(MarketComparisonResult::isAllItemsAvailable)
                .min(Comparator.comparingDouble(MarketComparisonResult::getTotalPrice))
                .orElse(null);

        return BasketComparisonResponse.builder()
                .basketItems(basketItemInfos)
                .marketComparisons(marketResults)
                .cheapestMarketId(cheapest != null ? cheapest.getMarketId() : null)
                .cheapestMarketName(cheapest != null ? cheapest.getMarketName() : null)
                .lowestTotal(lowestTotal)
                .highestTotal(highestTotal)
                .potentialSavings(highestTotal - lowestTotal)
                .build();
    }

    private MarketComparisonResult calculateMarketTotal(Market market, List<ReferenceItem> basketItems) {
        List<MarketItemPriceInfo> itemPrices = new ArrayList<>();
        List<String> missingItems = new ArrayList<>();
        double totalPrice = 0.0;

        for (ReferenceItem refItem : basketItems) {
            // Find the market item for this reference item at this market
            List<MarketItem> marketItems = marketItemRepository.findByReferenceItemId(refItem.getId())
                    .stream()
                    .filter(mi -> mi.getMarketId().equals(market.getId()))
                    .toList();

            if (marketItems.isEmpty()) {
                // Item not available at this market
                missingItems.add(refItem.getName());
                itemPrices.add(MarketItemPriceInfo.builder()
                        .referenceItemId(refItem.getId())
                        .referenceItemName(refItem.getName())
                        .available(false)
                        .price(0.0)
                        .currency(DEFAULT_CURRENCY)
                        .build());
            } else {
                // Use cached price from MarketItem (no need to query MarketPrice table)
                MarketItem marketItem = marketItems.get(0);
                
                if (marketItem.getCurrentPrice() != null && marketItem.getCurrentPrice() > 0) {
                    totalPrice += marketItem.getCurrentPrice();

                    itemPrices.add(MarketItemPriceInfo.builder()
                            .referenceItemId(refItem.getId())
                            .referenceItemName(refItem.getName())
                            .marketItemId(marketItem.getId())
                            .marketItemName(marketItem.getName())
                            .brand(marketItem.getBrand())
                            .price(marketItem.getCurrentPrice())
                            .currency(marketItem.getCurrency() != null ? marketItem.getCurrency() : DEFAULT_CURRENCY)
                            .isPromotion(marketItem.getIsPromotion() != null && marketItem.getIsPromotion())
                            .available(true)
                            .build());
                } else {
                    // No price data available
                    missingItems.add(refItem.getName());
                    itemPrices.add(MarketItemPriceInfo.builder()
                            .referenceItemId(refItem.getId())
                            .referenceItemName(refItem.getName())
                            .marketItemId(marketItem.getId())
                            .marketItemName(marketItem.getName())
                            .brand(marketItem.getBrand())
                            .available(false)
                            .price(0.0)
                            .currency(DEFAULT_CURRENCY)
                            .build());
                }
            }
        }

        return MarketComparisonResult.builder()
                .marketId(market.getId())
                .marketName(market.getName())
                .marketLogoUrl(market.getLogoUrl())
                .totalPrice(totalPrice)
                .currency(DEFAULT_CURRENCY)
                .allItemsAvailable(missingItems.isEmpty())
                .itemPrices(itemPrices)
                .missingItems(missingItems)
                .availableItemCount(basketItems.size() - missingItems.size())
                .totalItemCount(basketItems.size())
                .build();
    }
}
