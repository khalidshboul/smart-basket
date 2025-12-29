package com.smartbasket.backend.service;

import com.smartbasket.backend.dto.*;
import com.smartbasket.backend.model.Store;
import com.smartbasket.backend.model.StoreItem;
import com.smartbasket.backend.model.StorePrice;
import com.smartbasket.backend.model.ReferenceItem;
import com.smartbasket.backend.repository.StoreItemRepository;
import com.smartbasket.backend.repository.StorePriceRepository;
import com.smartbasket.backend.repository.StoreRepository;
import com.smartbasket.backend.repository.ReferenceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BasketComparisonService {

    private final ReferenceItemRepository referenceItemRepository;
    private final StoreRepository storeRepository;
    private final StoreItemRepository storeItemRepository;
    private final StorePriceRepository storePriceRepository;

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

        // 2. Get all active stores
        List<Store> activeStores = storeRepository.findByActiveTrue();

        // 3. For each store, calculate the basket total
        List<StoreComparisonResult> storeResults = new ArrayList<>();

        for (Store store : activeStores) {
            StoreComparisonResult result = calculateStoreTotal(store, basketReferenceItems);
            storeResults.add(result);
        }

        // 4. Sort by total price (cheapest first), putting stores with missing items last
        storeResults.sort((a, b) -> {
            // Stores with all items available come first
            if (a.isAllItemsAvailable() && !b.isAllItemsAvailable()) return -1;
            if (!a.isAllItemsAvailable() && b.isAllItemsAvailable()) return 1;
            // Then sort by price
            return Double.compare(a.getTotalPrice(), b.getTotalPrice());
        });

        // 5. Calculate savings and find cheapest
        Double lowestTotal = storeResults.stream()
                .filter(StoreComparisonResult::isAllItemsAvailable)
                .mapToDouble(StoreComparisonResult::getTotalPrice)
                .min()
                .orElse(0.0);

        Double highestTotal = storeResults.stream()
                .filter(StoreComparisonResult::isAllItemsAvailable)
                .mapToDouble(StoreComparisonResult::getTotalPrice)
                .max()
                .orElse(0.0);

        StoreComparisonResult cheapest = storeResults.stream()
                .filter(StoreComparisonResult::isAllItemsAvailable)
                .min(Comparator.comparingDouble(StoreComparisonResult::getTotalPrice))
                .orElse(null);

        return BasketComparisonResponse.builder()
                .basketItems(basketItemInfos)
                .storeComparisons(storeResults)
                .cheapestStoreId(cheapest != null ? cheapest.getStoreId() : null)
                .cheapestStoreName(cheapest != null ? cheapest.getStoreName() : null)
                .lowestTotal(lowestTotal)
                .highestTotal(highestTotal)
                .potentialSavings(highestTotal - lowestTotal)
                .build();
    }

    private StoreComparisonResult calculateStoreTotal(Store store, List<ReferenceItem> basketItems) {
        List<StoreItemPriceInfo> itemPrices = new ArrayList<>();
        List<String> missingItems = new ArrayList<>();
        double totalPrice = 0.0;

        for (ReferenceItem refItem : basketItems) {
            // Find the store item for this reference item at this store
            List<StoreItem> storeItems = storeItemRepository.findByReferenceItemId(refItem.getId())
                    .stream()
                    .filter(si -> si.getStoreId().equals(store.getId()))
                    .toList();

            if (storeItems.isEmpty()) {
                // Item not available at this store
                missingItems.add(refItem.getName());
                itemPrices.add(StoreItemPriceInfo.builder()
                        .referenceItemId(refItem.getId())
                        .referenceItemName(refItem.getName())
                        .available(false)
                        .price(0.0)
                        .currency(DEFAULT_CURRENCY)
                        .build());
            } else {
                // Use cached price from StoreItem (no need to query StorePrice table)
                StoreItem storeItem = storeItems.get(0);
                
                if (storeItem.getCurrentPrice() != null && storeItem.getCurrentPrice() > 0) {
                    totalPrice += storeItem.getCurrentPrice();

                    itemPrices.add(StoreItemPriceInfo.builder()
                            .referenceItemId(refItem.getId())
                            .referenceItemName(refItem.getName())
                            .storeItemId(storeItem.getId())
                            .storeItemName(storeItem.getName())
                            .brand(storeItem.getBrand())
                            .price(storeItem.getCurrentPrice())
                            .currency(storeItem.getCurrency() != null ? storeItem.getCurrency() : DEFAULT_CURRENCY)
                            .isPromotion(storeItem.getIsPromotion() != null && storeItem.getIsPromotion())
                            .available(true)
                            .build());
                } else {
                    // No price data available
                    missingItems.add(refItem.getName());
                    itemPrices.add(StoreItemPriceInfo.builder()
                            .referenceItemId(refItem.getId())
                            .referenceItemName(refItem.getName())
                            .storeItemId(storeItem.getId())
                            .storeItemName(storeItem.getName())
                            .brand(storeItem.getBrand())
                            .available(false)
                            .price(0.0)
                            .currency(DEFAULT_CURRENCY)
                            .build());
                }
            }
        }

        return StoreComparisonResult.builder()
                .storeId(store.getId())
                .storeName(store.getName())
                .storeLogoUrl(store.getLogoUrl())
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
