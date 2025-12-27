package com.smartbasket.backend.service;

import com.smartbasket.backend.dto.CreateMarketItemRequest;
import com.smartbasket.backend.dto.MarketItemDto;
import com.smartbasket.backend.exception.ResourceNotFoundException;
import com.smartbasket.backend.model.Market;
import com.smartbasket.backend.model.MarketItem;
import com.smartbasket.backend.model.ReferenceItem;
import com.smartbasket.backend.repository.MarketItemRepository;
import com.smartbasket.backend.repository.MarketRepository;
import com.smartbasket.backend.repository.ReferenceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketItemService {

    private final MarketItemRepository marketItemRepository;
    private final ReferenceItemRepository referenceItemRepository;
    private final MarketRepository marketRepository;

    private static final String DEFAULT_CURRENCY = "JOD";

    /**
     * Get all market items
     */
    public List<MarketItemDto> getAll() {
        List<MarketItem> items = marketItemRepository.findAll();
        
        // Build lookup maps for names
        Map<String, String> marketNames = marketRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Market::getId, Market::getName));
        Map<String, String> refItemNames = referenceItemRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ReferenceItem::getId, ReferenceItem::getName));
        
        return items.stream()
                .map(item -> toDto(item, 
                        marketNames.getOrDefault(item.getMarketId(), "Unknown"),
                        refItemNames.getOrDefault(item.getReferenceItemId(), "Unknown")))
                .collect(Collectors.toList());
    }

    /**
     * Create a market item and auto-link the market to the reference item
     */
    @Transactional
    public MarketItemDto createMarketItem(CreateMarketItemRequest request) {
        // Validate market exists
        Market market = marketRepository.findById(request.getMarketId())
                .orElseThrow(() -> new ResourceNotFoundException("Market not found: " + request.getMarketId()));

        // Validate reference item exists
        ReferenceItem refItem = referenceItemRepository.findById(request.getReferenceItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Reference item not found: " + request.getReferenceItemId()));

        // Create the market item
        MarketItem marketItem = MarketItem.builder()
                .marketId(request.getMarketId())
                .referenceItemId(request.getReferenceItemId())
                .name(request.getName())
                .brand(request.getBrand())
                .barcode(request.getBarcode())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .build();

        // Set initial price if provided
        if (request.getInitialPrice() != null) {
            marketItem.setCurrentPrice(request.getInitialPrice());
            marketItem.setOriginalPrice(request.getOriginalPrice());
            marketItem.setCurrency(request.getCurrency() != null ? request.getCurrency() : DEFAULT_CURRENCY);
            marketItem.setIsPromotion(request.getIsPromotion() != null ? request.getIsPromotion() : false);
            marketItem.setLastPriceUpdate(Instant.now());
        }

        MarketItem saved = marketItemRepository.save(marketItem);

        // Auto-link: Add marketId to reference item's linkedMarketIds
        addMarketToReferenceItem(refItem, request.getMarketId());

        return toDto(saved, market.getName(), refItem.getName());
    }

    /**
     * Get all market items for a reference item
     */
    public List<MarketItemDto> getByReferenceItemId(String referenceItemId) {
        List<MarketItem> items = marketItemRepository.findByReferenceItemId(referenceItemId);
        return enrichWithNames(items);
    }

    /**
     * Get all market items for a specific market
     */
    public List<MarketItemDto> getByMarketId(String marketId) {
        List<MarketItem> items = marketItemRepository.findByMarketId(marketId);
        return enrichWithNames(items);
    }

    /**
     * Get a market item by ID
     */
    public Optional<MarketItemDto> getById(String id) {
        return marketItemRepository.findById(id)
                .map(item -> {
                    String marketName = marketRepository.findById(item.getMarketId())
                            .map(Market::getName).orElse(null);
                    String refItemName = referenceItemRepository.findById(item.getReferenceItemId())
                            .map(ReferenceItem::getName).orElse(null);
                    return toDto(item, marketName, refItemName);
                });
    }

    /**
     * Delete a market item and cleanup linkage
     */
    @Transactional
    public boolean deleteMarketItem(String id) {
        Optional<MarketItem> optItem = marketItemRepository.findById(id);
        if (optItem.isEmpty()) {
            return false;
        }

        MarketItem item = optItem.get();
        String referenceItemId = item.getReferenceItemId();
        String marketId = item.getMarketId();

        // Delete the market item
        marketItemRepository.delete(item);

        // Check if any other market items still link this reference to this market
        boolean otherLinksExist = marketItemRepository.findByReferenceItemId(referenceItemId)
                .stream()
                .anyMatch(mi -> mi.getMarketId().equals(marketId));

        // If no other links exist, remove from linkedMarketIds
        if (!otherLinksExist) {
            removeMarketFromReferenceItem(referenceItemId, marketId);
        }

        return true;
    }

    /**
     * Add a market ID to reference item's linkedMarketIds
     */
    private void addMarketToReferenceItem(ReferenceItem refItem, String marketId) {
        if (refItem.getLinkedMarketIds() == null) {
            refItem.setLinkedMarketIds(new ArrayList<>());
        }
        if (!refItem.getLinkedMarketIds().contains(marketId)) {
            refItem.getLinkedMarketIds().add(marketId);
            referenceItemRepository.save(refItem);
        }
    }

    /**
     * Remove a market ID from reference item's linkedMarketIds
     */
    private void removeMarketFromReferenceItem(String referenceItemId, String marketId) {
        referenceItemRepository.findById(referenceItemId).ifPresent(refItem -> {
            if (refItem.getLinkedMarketIds() != null) {
                refItem.getLinkedMarketIds().remove(marketId);
                referenceItemRepository.save(refItem);
            }
        });
    }

    /**
     * Enrich market items with market and reference item names
     */
    private List<MarketItemDto> enrichWithNames(List<MarketItem> items) {
        if (items.isEmpty()) {
            return List.of();
        }

        // Batch fetch market and reference item names
        List<String> marketIds = items.stream().map(MarketItem::getMarketId).distinct().toList();
        List<String> refItemIds = items.stream().map(MarketItem::getReferenceItemId).distinct().toList();

        Map<String, String> marketNames = marketRepository.findAllById(marketIds).stream()
                .collect(Collectors.toMap(Market::getId, Market::getName));
        Map<String, String> refItemNames = referenceItemRepository.findAllById(refItemIds).stream()
                .collect(Collectors.toMap(ReferenceItem::getId, ReferenceItem::getName));

        return items.stream()
                .map(item -> toDto(item,
                        marketNames.get(item.getMarketId()),
                        refItemNames.get(item.getReferenceItemId())))
                .collect(Collectors.toList());
    }

    private MarketItemDto toDto(MarketItem item, String marketName, String referenceItemName) {
        Double discountPercentage = null;
        if (item.getOriginalPrice() != null && item.getCurrentPrice() != null && item.getOriginalPrice() > 0) {
            discountPercentage = ((item.getOriginalPrice() - item.getCurrentPrice()) / item.getOriginalPrice()) * 100;
        }
        
        return MarketItemDto.builder()
                .id(item.getId())
                .marketId(item.getMarketId())
                .marketName(marketName)
                .referenceItemId(item.getReferenceItemId())
                .referenceItemName(referenceItemName)
                .name(item.getName())
                .brand(item.getBrand())
                .barcode(item.getBarcode())
                .images(item.getImages() != null ? item.getImages() : new ArrayList<>())
                .currentPrice(item.getCurrentPrice())
                .originalPrice(item.getOriginalPrice())
                .discountPercentage(discountPercentage)
                .currency(item.getCurrency())
                .isPromotion(item.getIsPromotion())
                .lastPriceUpdate(item.getLastPriceUpdate())
                .build();
    }
}
