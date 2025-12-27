package com.smartbasket.backend.controller;

import com.smartbasket.backend.dto.CreateMarketItemRequest;
import com.smartbasket.backend.dto.MarketItemDto;
import com.smartbasket.backend.service.MarketItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketItemController {

    private final MarketItemService marketItemService;

    /**
     * Get all market items
     */
    @GetMapping
    public ResponseEntity<List<MarketItemDto>> getAllMarketItems() {
        List<MarketItemDto> items = marketItemService.getAll();
        return ResponseEntity.ok(items);
    }

    /**
     * Create a market item and auto-link to reference item
     */
    @PostMapping
    public ResponseEntity<MarketItemDto> createMarketItem(@Valid @RequestBody CreateMarketItemRequest request) {
        MarketItemDto created = marketItemService.createMarketItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get a market item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MarketItemDto> getMarketItem(@PathVariable String id) {
        return marketItemService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all market items for a reference item
     */
    @GetMapping("/by-reference/{referenceItemId}")
    public ResponseEntity<List<MarketItemDto>> getByReferenceItem(@PathVariable String referenceItemId) {
        List<MarketItemDto> items = marketItemService.getByReferenceItemId(referenceItemId);
        return ResponseEntity.ok(items);
    }

    /**
     * Get all market items for a specific market
     */
    @GetMapping("/by-market/{marketId}")
    public ResponseEntity<List<MarketItemDto>> getByMarket(@PathVariable String marketId) {
        List<MarketItemDto> items = marketItemService.getByMarketId(marketId);
        return ResponseEntity.ok(items);
    }

    /**
     * Delete a market item and cleanup linkage
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarketItem(@PathVariable String id) {
        boolean deleted = marketItemService.deleteMarketItem(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
